const fs = require("fs");
const path = require("path");
const express = require("express");
const { authenticateUser, requireAdmin } = require("../middleware/auth");
const { asyncHandler } = require("../utils/asyncHandler");
const { HttpError } = require("../utils/httpError");
const { ORDERS_FILE, RECEIPTS_DIR, INVENTORY_FILE } = require("../config/constants");
const { readJsonFile, writeJsonFile, ensureDirectory } = require("../services/jsonStore");
const { getMenuItems, incrementMenuSales } = require("../services/menuCatalog");
const { emitAdmin } = require("../services/socketService");
const { buildDashboardSummary } = require("../services/dashboardService");

const router = express.Router();
const ORDER_STATUSES = ["Pending", "Preparing", "Delivered", "Cancelled"];

function buildOrderId(orderNumber) {
  return `ORD-${String(orderNumber).padStart(3, "0")}`;
}

function formatReceipt(order) {
  const lines = [
    "The Third Sip",
    "Order Receipt",
    "====================",
    `Order ID: ${order.id}`,
    `Customer: ${order.customer}`,
    `Email: ${order.customerEmail}`,
    `Status: ${order.status}`,
    `Placed At: ${new Date(order.createdAt).toLocaleString("en-IN")}`,
    "",
    "Items:",
    ...order.items.map(
      (item) =>
        `- ${item.name} x${item.qty} @ INR ${item.price} = INR ${item.price * item.qty}`
    ),
    "",
    `Total: INR ${order.total}`,
    "",
    "Thanks for visiting The Third Sip.",
  ];

  return lines.join("\n");
}

async function writeReceipt(order) {
  await ensureDirectory(RECEIPTS_DIR);
  const receiptPath = path.join(RECEIPTS_DIR, `${order.id}.txt`);
  await fs.promises.writeFile(receiptPath, formatReceipt(order), "utf-8");
  return receiptPath;
}

async function ensureReceiptFile(order) {
  const receiptPath = path.join(RECEIPTS_DIR, `${order.id}.txt`);
  try {
    await fs.promises.access(receiptPath);
    return receiptPath;
  } catch (error) {
    return writeReceipt(order);
  }
}

async function applyInventoryUsage(orderItems) {
  const inventory = await readJsonFile(INVENTORY_FILE, []);
  const totalBeverages = orderItems
    .filter((item) => item.category !== "Food")
    .reduce((sum, item) => sum + Number(item.qty || 0), 0);

  const totalFood = orderItems
    .filter((item) => item.category === "Food")
    .reduce((sum, item) => sum + Number(item.qty || 0), 0);

  for (const item of inventory) {
    if (item.name === "Disposable Cups (M)") {
      item.stock = Math.max(0, Number(item.stock) - totalBeverages);
    }

    if (item.name === "Arabica Coffee Beans") {
      item.stock = Math.max(0, Number((Number(item.stock) - totalBeverages * 0.04).toFixed(2)));
    }

    if (item.name === "Full Cream Milk") {
      item.stock = Math.max(0, Number((Number(item.stock) - totalBeverages * 0.18).toFixed(2)));
    }

    if (item.name === "Oat Milk") {
      item.stock = Math.max(0, Number((Number(item.stock) - totalBeverages * 0.05).toFixed(2)));
    }

    if (item.name === "Sugar (White)") {
      item.stock = Math.max(0, Number((Number(item.stock) - totalBeverages * 0.01).toFixed(2)));
    }

    if (item.name === "Cocoa Powder") {
      item.stock = Math.max(0, Number((Number(item.stock) - totalFood * 0.005).toFixed(2)));
    }
  }

  await writeJsonFile(INVENTORY_FILE, inventory);
}

async function emitSummaryUpdate() {
  const summary = await buildDashboardSummary();
  emitAdmin("summary:updated", summary);
}

router.use(authenticateUser);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const allOrders = await readJsonFile(ORDERS_FILE, []);
    const orders =
      req.user.role === "admin"
        ? allOrders
        : allOrders.filter((order) => order.userId === req.user.id);

    const sortedOrders = [...orders].sort(
      (left, right) => new Date(right.createdAt) - new Date(left.createdAt)
    );

    res.json({ orders: sortedOrders });
  })
);

router.get(
  "/:id/receipt",
  asyncHandler(async (req, res) => {
    const orders = await readJsonFile(ORDERS_FILE, []);
    const order = orders.find((entry) => entry.id === req.params.id);
    if (!order) {
      throw new HttpError(404, "Order not found");
    }

    const canAccess = req.user.role === "admin" || req.user.id === order.userId;
    if (!canAccess) {
      throw new HttpError(403, "You cannot access this receipt");
    }

    const receiptPath = await ensureReceiptFile(order);
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    fs.createReadStream(receiptPath).pipe(res);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const orders = await readJsonFile(ORDERS_FILE, []);
    const order = orders.find((entry) => entry.id === req.params.id);
    if (!order) {
      throw new HttpError(404, "Order not found");
    }

    const canAccess = req.user.role === "admin" || req.user.id === order.userId;
    if (!canAccess) {
      throw new HttpError(403, "You cannot access this order");
    }

    res.json({ order });
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { items, notes } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      throw new HttpError(400, "Order items are required");
    }

    const menuItems = await getMenuItems({ includeInactive: true });
    const menuIndex = new Map(menuItems.map((item) => [item.id, item]));

    const normalizedItems = items.map((item) => {
      const menuItemId = Number(item.menuItemId || item.id);
      const menuItem = menuIndex.get(menuItemId);

      if (!menuItem || !menuItem.active) {
        throw new HttpError(400, `Menu item ${menuItemId} is not available`);
      }

      const qty = Math.max(1, Number(item.qty || 1));
      return {
        menuItemId: menuItem.id,
        name: menuItem.name,
        qty,
        price: Number(item.price ?? menuItem.price),
        category: menuItem.category,
        customization: item.customization || null,
      };
    });

    const total = normalizedItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const orders = await readJsonFile(ORDERS_FILE, []);
    const nextOrderNumber =
      orders.reduce((maxValue, order) => Math.max(maxValue, Number(order.orderNumber || 0)), 0) + 1;

    const order = {
      id: buildOrderId(nextOrderNumber),
      orderNumber: nextOrderNumber,
      userId: req.user.id,
      customer: req.user.name,
      customerEmail: req.user.email,
      items: normalizedItems,
      total,
      status: "Pending",
      notes: String(notes || "").trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.push(order);
    await writeJsonFile(ORDERS_FILE, orders);
    await incrementMenuSales(normalizedItems);
    await applyInventoryUsage(normalizedItems);
    await writeReceipt(order);

    emitAdmin("order:created", { order });
    await emitSummaryUpdate();

    res.status(201).json({
      message: "Order placed successfully",
      order,
      receiptUrl: `/api/orders/${order.id}/receipt`,
    });
  })
);

router.patch(
  "/:id/status",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    if (!ORDER_STATUSES.includes(status)) {
      throw new HttpError(400, "Invalid order status");
    }

    const orders = await readJsonFile(ORDERS_FILE, []);
    const orderIndex = orders.findIndex((order) => order.id === req.params.id);
    if (orderIndex === -1) {
      throw new HttpError(404, "Order not found");
    }

    orders[orderIndex] = {
      ...orders[orderIndex],
      status,
      updatedAt: new Date().toISOString(),
    };

    await writeJsonFile(ORDERS_FILE, orders);
    emitAdmin("order:updated", { order: orders[orderIndex] });
    await emitSummaryUpdate();

    res.json({
      message: "Order status updated",
      order: orders[orderIndex],
    });
  })
);

module.exports = router;

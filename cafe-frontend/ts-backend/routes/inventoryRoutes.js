const express = require("express");
const { INVENTORY_FILE } = require("../config/constants");
const { authenticateUser, requireAdmin } = require("../middleware/auth");
const { asyncHandler } = require("../utils/asyncHandler");
const { HttpError } = require("../utils/httpError");
const { readJsonFile, writeJsonFile } = require("../services/jsonStore");
const { emitAdmin } = require("../services/socketService");
const { buildDashboardSummary } = require("../services/dashboardService");

const router = express.Router();

function normalizeStock(value) {
  return Number(Number(value || 0).toFixed(2));
}

async function emitSummaryUpdate() {
  const summary = await buildDashboardSummary();
  emitAdmin("summary:updated", summary);
}

router.use(authenticateUser, requireAdmin);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const inventory = await readJsonFile(INVENTORY_FILE, []);
    const category = req.query.category;
    const items =
      category && category !== "All"
        ? inventory.filter((item) => item.category === category)
        : inventory;

    res.json({ items });
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const inventory = await readJsonFile(INVENTORY_FILE, []);
    const item = inventory.find((entry) => entry.id === Number(req.params.id));
    if (!item) {
      throw new HttpError(404, "Inventory item not found");
    }
    res.json({ item });
  })
);

router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const inventory = await readJsonFile(INVENTORY_FILE, []);
    const itemIndex = inventory.findIndex((entry) => entry.id === Number(req.params.id));
    if (itemIndex === -1) {
      throw new HttpError(404, "Inventory item not found");
    }

    const currentItem = inventory[itemIndex];
    const updates = { ...req.body };

    if (updates.restockBy !== undefined) {
      updates.stock = normalizeStock(Number(currentItem.stock) + Number(updates.restockBy));
      delete updates.restockBy;
    }

    inventory[itemIndex] = {
      ...currentItem,
      ...updates,
      stock: updates.stock !== undefined ? normalizeStock(updates.stock) : currentItem.stock,
      reorder: updates.reorder !== undefined ? Number(updates.reorder) : currentItem.reorder,
    };

    await writeJsonFile(INVENTORY_FILE, inventory);
    emitAdmin("inventory:updated", { item: inventory[itemIndex] });
    await emitSummaryUpdate();

    res.json({
      message: "Inventory updated",
      item: inventory[itemIndex],
    });
  })
);

module.exports = router;

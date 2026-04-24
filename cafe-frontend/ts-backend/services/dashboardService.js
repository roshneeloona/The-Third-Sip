const { INVENTORY_FILE, ORDERS_FILE } = require("../config/constants");
const { readJsonFile } = require("./jsonStore");
const { getMenuItems } = require("./menuCatalog");

function daysUntil(expiryDate) {
  const today = Date.now();
  const expiresAt = new Date(expiryDate).getTime();
  return Math.ceil((expiresAt - today) / 86400000);
}

function expiryStatus(expiryDate) {
  const days = daysUntil(expiryDate);
  if (days < 0) {
    return "expired";
  }
  if (days <= 7) {
    return "critical";
  }
  if (days <= 30) {
    return "warning";
  }
  return "good";
}

function buildLastSevenDays() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return {
      key: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString("en-IN", { weekday: "short" }),
    };
  });
}

async function buildDashboardSummary() {
  const [orders, inventory, menuItems] = await Promise.all([
    readJsonFile(ORDERS_FILE, []),
    readJsonFile(INVENTORY_FILE, []),
    getMenuItems({ includeInactive: true }),
  ]);

  const todayKey = new Date().toISOString().slice(0, 10);
  const weeklyDays = buildLastSevenDays();
  const weeklySales = weeklyDays.map((day) => {
    const revenue = orders
      .filter((order) => order.createdAt.slice(0, 10) === day.key && order.status !== "Cancelled")
      .reduce((sum, order) => sum + Number(order.total || 0), 0);

    return {
      day: day.label,
      revenue,
    };
  });

  const expiryAlerts = inventory
    .map((item) => ({
      ...item,
      expiryState: expiryStatus(item.expiry),
      daysLeft: daysUntil(item.expiry),
    }))
    .filter((item) => item.expiryState === "critical" || item.expiryState === "expired");

  const lowStock = inventory.filter((item) => Number(item.stock) <= Number(item.reorder));
  const todayOrders = orders.filter((order) => order.createdAt.slice(0, 10) === todayKey);
  const pendingOrders = orders.filter((order) => order.status === "Pending");
  const weeklyRevenue = weeklySales.reduce((sum, item) => sum + item.revenue, 0);
  const topSellers = [...menuItems].sort((left, right) => right.sold - left.sold).slice(0, 5);
  const recentOrders = [...orders]
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .slice(0, 5);

  return {
    stats: {
      weeklyRevenue,
      todayOrders: todayOrders.length,
      pendingOrders: pendingOrders.length,
      expiryAlerts: expiryAlerts.length,
      lowStock: lowStock.length,
    },
    salesByDay: weeklySales,
    topSellers,
    expiryAlerts,
    lowStock,
    recentOrders,
  };
}

module.exports = {
  buildDashboardSummary,
  expiryStatus,
  daysUntil,
};

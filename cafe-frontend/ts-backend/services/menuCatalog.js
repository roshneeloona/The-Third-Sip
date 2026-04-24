const path = require("path");
const { pathToFileURL } = require("url");
const { MENU_META_FILE } = require("../config/constants");
const { readJsonFile, writeJsonFile } = require("./jsonStore");
const { HttpError } = require("../utils/httpError");

const MENU_SOURCE_FILE = path.resolve(__dirname, "../../src/data/coffeeData.js");

function defaultSoldCount(itemId) {
  return 18 + ((Number(itemId) * 17) % 95);
}

function normalizeMenuItem(item, overrides = {}) {
  return {
    id: item.id,
    name: overrides.name || item.name,
    price: overrides.price ?? item.price,
    category: overrides.category || item.category,
    description: overrides.description || item.description,
    image: overrides.image || item.image,
    active: overrides.active ?? true,
    sold: overrides.sold ?? defaultSoldCount(item.id),
  };
}

async function loadBaseMenuItems() {
  const menuModule = await import(pathToFileURL(MENU_SOURCE_FILE).href);
  return Array.isArray(menuModule.menuItems) ? menuModule.menuItems : [];
}

async function getMenuItems(options = {}) {
  const { includeInactive = false, category, limit } = options;
  const baseMenu = await loadBaseMenuItems();
  const menuMeta = await readJsonFile(MENU_META_FILE, {});

  let items = baseMenu.map((item) => normalizeMenuItem(item, menuMeta[String(item.id)] || {}));

  if (category && category !== "All") {
    items = items.filter((item) => item.category === category);
  }

  if (!includeInactive) {
    items = items.filter((item) => item.active);
  }

  if (limit) {
    items = items.slice(0, Number(limit));
  }

  return items;
}

async function getMenuItemById(id, options = {}) {
  const items = await getMenuItems({ includeInactive: true });
  return items.find((item) => item.id === Number(id)) || null;
}

async function updateMenuItem(id, updates) {
  const menuItem = await getMenuItemById(id, { includeInactive: true });

  if (!menuItem) {
    throw new HttpError(404, "Menu item not found");
  }

  const allowedFields = ["name", "price", "category", "description", "image", "active", "sold"];
  const sanitizedUpdates = allowedFields.reduce((result, field) => {
    if (updates[field] !== undefined) {
      result[field] = updates[field];
    }
    return result;
  }, {});

  const currentMeta = await readJsonFile(MENU_META_FILE, {});
  currentMeta[String(menuItem.id)] = {
    ...(currentMeta[String(menuItem.id)] || {}),
    ...sanitizedUpdates,
  };

  await writeJsonFile(MENU_META_FILE, currentMeta);
  return getMenuItemById(id, { includeInactive: true });
}

async function incrementMenuSales(orderItems) {
  const currentMeta = await readJsonFile(MENU_META_FILE, {});
  const menuItems = await getMenuItems({ includeInactive: true });
  const menuIndex = new Map(menuItems.map((item) => [item.id, item]));

  for (const orderItem of orderItems) {
    const itemId = Number(orderItem.menuItemId);
    const existingItem = menuIndex.get(itemId);
    if (!existingItem) {
      continue;
    }

    const key = String(itemId);
    const existingMeta = currentMeta[key] || {};
    currentMeta[key] = {
      ...existingMeta,
      sold: (existingMeta.sold ?? existingItem.sold ?? defaultSoldCount(itemId)) + Number(orderItem.qty || 0),
      active: existingMeta.active ?? existingItem.active ?? true,
    };
  }

  await writeJsonFile(MENU_META_FILE, currentMeta);
}

module.exports = {
  getMenuItems,
  getMenuItemById,
  updateMenuItem,
  incrementMenuSales,
};

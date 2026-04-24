const DEFAULT_INVENTORY = [
  { id: 1, name: "Arabica Coffee Beans", category: "Beans", stock: 12, unit: "kg", expiry: "2026-05-14", reorder: 10 },
  { id: 2, name: "Robusta Coffee Beans", category: "Beans", stock: 6, unit: "kg", expiry: "2026-05-08", reorder: 8 },
  { id: 3, name: "Oat Milk", category: "Milk", stock: 20, unit: "L", expiry: "2026-04-28", reorder: 15 },
  { id: 4, name: "Full Cream Milk", category: "Milk", stock: 35, unit: "L", expiry: "2026-04-26", reorder: 20 },
  { id: 5, name: "Vanilla Syrup", category: "Syrups", stock: 3, unit: "btl", expiry: "2026-12-01", reorder: 5 },
  { id: 6, name: "Caramel Syrup", category: "Syrups", stock: 7, unit: "btl", expiry: "2026-11-20", reorder: 5 },
  { id: 7, name: "Hazelnut Syrup", category: "Syrups", stock: 2, unit: "btl", expiry: "2027-01-10", reorder: 5 },
  { id: 8, name: "Sugar (White)", category: "Extras", stock: 18, unit: "kg", expiry: "2027-06-01", reorder: 10 },
  { id: 9, name: "Cocoa Powder", category: "Extras", stock: 4, unit: "kg", expiry: "2026-09-30", reorder: 5 },
  { id: 10, name: "Disposable Cups (M)", category: "Packaging", stock: 200, unit: "pcs", expiry: "2028-01-01", reorder: 100 },
];

const DEFAULT_ORDERS = [
  {
    id: "ORD-001",
    orderNumber: 1,
    userId: 1,
    customer: "roshnee loona",
    customerEmail: "roshneeloona@gmail.com",
    items: [
      { menuItemId: 2, name: "Cappuccino", qty: 1, price: 180, category: "Hot Beverages" },
      { menuItemId: 33, name: "Chocolate Croissant", qty: 1, price: 180, category: "Food" },
    ],
    total: 360,
    status: "Delivered",
    notes: "",
    createdAt: "2026-04-23T09:12:00.000Z",
    updatedAt: "2026-04-23T09:45:00.000Z",
  },
  {
    id: "ORD-002",
    orderNumber: 2,
    userId: 2,
    customer: "Simran",
    customerEmail: "leh.ladhak.0007@gmail.com",
    items: [
      { menuItemId: 8, name: "Cold Brew", qty: 1, price: 220, category: "Cold Beverages" },
      { menuItemId: 34, name: "Blueberry Muffin", qty: 1, price: 150, category: "Food" },
    ],
    total: 370,
    status: "Preparing",
    notes: "Less ice",
    createdAt: "2026-04-23T10:05:00.000Z",
    updatedAt: "2026-04-23T10:08:00.000Z",
  },
  {
    id: "ORD-003",
    orderNumber: 3,
    userId: 3,
    customer: "Roshnee Loona",
    customerEmail: "loonaroshnee18@gmail.com",
    items: [
      { menuItemId: 3, name: "Latte", qty: 2, price: 200, category: "Hot Beverages" },
    ],
    total: 400,
    status: "Pending",
    notes: "",
    createdAt: "2026-04-23T11:02:00.000Z",
    updatedAt: "2026-04-23T11:02:00.000Z",
  },
  {
    id: "ORD-004",
    orderNumber: 4,
    userId: 1,
    customer: "roshnee loona",
    customerEmail: "roshneeloona@gmail.com",
    items: [
      { menuItemId: 15, name: "Hazelnut Latte", qty: 1, price: 220, category: "Hot Beverages" },
      { menuItemId: 35, name: "Avocado Toast", qty: 1, price: 220, category: "Food" },
    ],
    total: 440,
    status: "Delivered",
    notes: "",
    createdAt: "2026-04-22T15:22:00.000Z",
    updatedAt: "2026-04-22T15:50:00.000Z",
  },
  {
    id: "ORD-005",
    orderNumber: 5,
    userId: 2,
    customer: "Simran",
    customerEmail: "leh.ladhak.0007@gmail.com",
    items: [
      { menuItemId: 4, name: "Mocha", qty: 1, price: 210, category: "Hot Beverages" },
      { menuItemId: 33, name: "Chocolate Croissant", qty: 1, price: 180, category: "Food" },
    ],
    total: 390,
    status: "Cancelled",
    notes: "",
    createdAt: "2026-04-21T13:15:00.000Z",
    updatedAt: "2026-04-21T13:40:00.000Z",
  },
];

const DEFAULT_MENU_META = {};

module.exports = {
  DEFAULT_INVENTORY,
  DEFAULT_ORDERS,
  DEFAULT_MENU_META,
};

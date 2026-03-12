export const INVENTORY = [
  { id: 1,  name: "Arabica Coffee Beans", category: "Beans",     stock: 12,  unit: "kg",  expiry: "2025-08-15", reorder: 10  },
  { id: 2,  name: "Robusta Coffee Beans", category: "Beans",     stock: 6,   unit: "kg",  expiry: "2025-07-01", reorder: 8   },
  { id: 3,  name: "Oat Milk",             category: "Milk",      stock: 20,  unit: "L",   expiry: "2025-03-22", reorder: 15  },
  { id: 4,  name: "Full Cream Milk",      category: "Milk",      stock: 35,  unit: "L",   expiry: "2025-03-18", reorder: 20  },
  { id: 5,  name: "Vanilla Syrup",        category: "Syrups",    stock: 3,   unit: "btl", expiry: "2025-12-01", reorder: 5   },
  { id: 6,  name: "Caramel Syrup",        category: "Syrups",    stock: 7,   unit: "btl", expiry: "2025-11-20", reorder: 5   },
  { id: 7,  name: "Hazelnut Syrup",       category: "Syrups",    stock: 2,   unit: "btl", expiry: "2026-01-10", reorder: 5   },
  { id: 8,  name: "Sugar (White)",        category: "Extras",    stock: 18,  unit: "kg",  expiry: "2026-06-01", reorder: 10  },
  { id: 9,  name: "Cocoa Powder",         category: "Extras",    stock: 4,   unit: "kg",  expiry: "2025-09-30", reorder: 5   },
  { id: 10, name: "Disposable Cups (M)",  category: "Packaging", stock: 200, unit: "pcs", expiry: "2027-01-01", reorder: 100 },
];

export const ORDERS = [
  { id: "ORD-001", customer: "Priya S.",  items: ["Cappuccino", "Croissant"],     total: 380, status: "Delivered", time: "09:12 AM" },
  { id: "ORD-002", customer: "Arjun M.",  items: ["Cold Brew", "Choco Muffin"],   total: 295, status: "Preparing", time: "10:05 AM" },
  { id: "ORD-003", customer: "Sneha R.",  items: ["Latte", "Latte"],              total: 440, status: "Delivered", time: "10:30 AM" },
  { id: "ORD-004", customer: "Rahul K.",  items: ["Espresso"],                    total: 150, status: "Pending",   time: "11:02 AM" },
  { id: "ORD-005", customer: "Meera T.",  items: ["Caramel Macchiato", "Cookie"], total: 420, status: "Delivered", time: "Yesterday" },
  { id: "ORD-006", customer: "Dev P.",    items: ["Americano", "Americano"],      total: 300, status: "Cancelled", time: "Yesterday" },
  { id: "ORD-007", customer: "Ananya B.", items: ["Mocha", "Brownie"],            total: 510, status: "Delivered", time: "Yesterday" },
];

export const WEEKLY_SALES = [
  { day: "Mon", revenue: 3200 },
  { day: "Tue", revenue: 4100 },
  { day: "Wed", revenue: 3750 },
  { day: "Thu", revenue: 5200 },
  { day: "Fri", revenue: 6800 },
  { day: "Sat", revenue: 7400 },
  { day: "Sun", revenue: 4900 },
];

export const MENU_ITEMS = [
  { id: 1, name: "Espresso",          price: 150, category: "Hot",  sold: 84,  active: true  },
  { id: 2, name: "Cappuccino",        price: 210, category: "Hot",  sold: 120, active: true  },
  { id: 3, name: "Caramel Macchiato", price: 250, category: "Hot",  sold: 95,  active: true  },
  { id: 4, name: "Cold Brew",         price: 220, category: "Cold", sold: 73,  active: true  },
  { id: 5, name: "Iced Latte",        price: 230, category: "Cold", sold: 88,  active: true  },
  { id: 6, name: "Mocha",             price: 260, category: "Hot",  sold: 61,  active: false },
];
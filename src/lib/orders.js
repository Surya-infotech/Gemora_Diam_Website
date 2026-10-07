export const STATUSES = ["Processing", "Crafted", "Shipped", "Delivered"];

export const ORDERS = [
  {
    id: "GD-48291",
    date: "2026-09-28",
    items: [{ productId: "eternelle-solitaire", metal: "Platinum", qty: 1 }],
    total: 4850,
    status: "Crafted"
  },
  {
    id: "GD-47710",
    date: "2026-09-12",
    items: [
      { productId: "perle-lumiere", metal: "Platinum", qty: 1 },
      { productId: "aube-hoops", metal: "18k Yellow Gold", qty: 1 }
    ],
    total: 5040,
    status: "Shipped",
    tracking: "FX 7720 1934 0021"
  },
  {
    id: "GD-45102",
    date: "2026-07-03",
    items: [{ productId: "riviera-tennis", metal: "Rose Gold", qty: 1 }],
    total: 7600,
    status: "Delivered",
    tracking: "FX 7718 0042 9910"
  },
  {
    id: "GD-41877",
    date: "2026-03-19",
    items: [
      { productId: "verdant-drop", metal: "18k Yellow Gold", qty: 1 },
      { productId: "stacking-trio", metal: "18k Yellow Gold", qty: 1 }
    ],
    total: 3670,
    status: "Delivered",
    tracking: "DHL 4410 2219 88"
  }
];

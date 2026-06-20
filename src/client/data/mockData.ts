export interface Product {
  id: number;
  barcode: string;
  name: string;
  description: string | null;
  quantity: number;
  price: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: number;
  productId: number;
  productName: string;
  changeType: 'ADD' | 'SUBTRACT';
  quantity: number;
  timestamp: string;
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    barcode: "4902505117572",
    name: "Logitech MX Master 3S",
    description: "Ergonomic wireless mouse with 8K DPI sensor and quiet clicks.",
    quantity: 47,
    price: 99.99,
    createdAt: "2026-06-01T08:30:00Z",
    updatedAt: "2026-06-20T14:15:00Z"
  },
  {
    id: 2,
    barcode: "0097855171115",
    name: "Keychron K8 Pro",
    description: "Wireless mechanical keyboard with hot-swappable Gateron switches.",
    quantity: 23,
    price: 109.00,
    createdAt: "2026-06-03T10:15:00Z",
    updatedAt: "2026-06-19T09:45:00Z"
  },
  {
    id: 3,
    barcode: "0190199731073",
    name: "Dell U2723QE Monitor",
    description: "27-inch 4K UHD USB-C monitor with IPS Black panel technology.",
    quantity: 8,
    price: 519.99,
    createdAt: "2026-06-05T11:00:00Z",
    updatedAt: "2026-06-20T12:00:00Z"
  },
  {
    id: 4,
    barcode: "0856234005118",
    name: "Anker 8-in-1 USB-C Hub",
    description: "Multiport adapter with HDMI 4K, SD reader, and 100W power delivery.",
    quantity: 71,
    price: 35.99,
    createdAt: "2026-06-07T09:20:00Z",
    updatedAt: "2026-06-20T10:30:00Z"
  },
  {
    id: 5,
    barcode: "4549659002722",
    name: "Sony WH-1000XM5",
    description: "Wireless noise-cancelling over-ear headphones with 30hr battery.",
    quantity: 15,
    price: 349.99,
    createdAt: "2026-06-10T14:05:00Z",
    updatedAt: "2026-06-19T17:12:00Z"
  },
  {
    id: 6,
    barcode: "8806094734195",
    name: "Samsung T7 Shield 2TB",
    description: "Portable SSD with IP65 water and dust resistance, up to 1050 MB/s.",
    quantity: 34,
    price: 159.99,
    createdAt: "2026-06-12T08:30:00Z",
    updatedAt: "2026-06-18T16:20:00Z"
  },
  {
    id: 7,
    barcode: "0718037899404",
    name: "WD Black SN850X 1TB",
    description: "PCIe Gen4 NVMe M.2 internal SSD with up to 7300 MB/s read.",
    quantity: 12,
    price: 89.99,
    createdAt: "2026-06-14T11:00:00Z",
    updatedAt: "2026-06-20T09:10:00Z"
  },
  {
    id: 8,
    barcode: "4718017293624",
    name: "ASUS ROG Strix B650E-F",
    description: "AM5 ATX gaming motherboard with DDR5, PCIe 5.0, and Wi-Fi 6E.",
    quantity: 5,
    price: 279.99,
    createdAt: "2026-06-15T09:00:00Z",
    updatedAt: "2026-06-19T14:30:00Z"
  }
];

export const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 1,
    productId: 1,
    productName: "Logitech MX Master 3S",
    changeType: "ADD",
    quantity: 12,
    timestamp: "2026-06-20T14:15:00Z"
  },
  {
    id: 2,
    productId: 3,
    productName: "Dell U2723QE Monitor",
    changeType: "SUBTRACT",
    quantity: 2,
    timestamp: "2026-06-20T12:00:00Z"
  },
  {
    id: 3,
    productId: 4,
    productName: "Anker 8-in-1 USB-C Hub",
    changeType: "ADD",
    quantity: 20,
    timestamp: "2026-06-20T10:30:00Z"
  },
  {
    id: 4,
    productId: 5,
    productName: "Sony WH-1000XM5",
    changeType: "SUBTRACT",
    quantity: 3,
    timestamp: "2026-06-19T17:12:00Z"
  },
  {
    id: 5,
    productId: 2,
    productName: "Keychron K8 Pro",
    changeType: "ADD",
    quantity: 5,
    timestamp: "2026-06-19T09:45:00Z"
  },
  {
    id: 6,
    productId: 6,
    productName: "Samsung T7 Shield 2TB",
    changeType: "SUBTRACT",
    quantity: 1,
    timestamp: "2026-06-18T16:20:00Z"
  },
  {
    id: 7,
    productId: 7,
    productName: "WD Black SN850X 1TB",
    changeType: "ADD",
    quantity: 8,
    timestamp: "2026-06-18T11:00:00Z"
  },
  {
    id: 8,
    productId: 8,
    productName: "ASUS ROG Strix B650E-F",
    changeType: "SUBTRACT",
    quantity: 1,
    timestamp: "2026-06-17T14:30:00Z"
  }
];

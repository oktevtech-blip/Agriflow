// import type {
//   Farmer,
//   Crop,
//   Harvest,
//   Order,
//   Delivery,
//   AppNotification,
// } from '@/types';

// // ─── Mock data for the current farmer ───

// export const currentFarmer: Farmer = {
//   id: 'farmer-1',
//   name: 'Kwame Mensah',
//   phone: '+233 24 555 0101',
//   location: 'Kumasi, Ashanti',
//   farmSizeHectares: 4.5,
//   joinedDate: '2025-01-15',
// };

// export const crops: Crop[] = [
//   { id: 'crop-1', name: 'Maize', category: 'Grain', unit: 'kg' },
//   { id: 'crop-2', name: 'Tomatoes', category: 'Vegetable', unit: 'kg' },
//   { id: 'crop-3', name: 'Cassava', category: 'Tuber', unit: 'kg' },
//   { id: 'crop-4', name: 'Pepper', category: 'Vegetable', unit: 'kg' },
//   { id: 'crop-5', name: 'Yam', category: 'Tuber', unit: 'kg' },
// ];

// export const harvests: Harvest[] = [
//   {
//     id: 'h-1',
//     cropId: 'crop-1',
//     cropName: 'Maize',
//     cropCategory: 'Grain',
//     plantingDate: '2026-04-15',
//     expectedHarvestDate: '2026-08-20',
//     actualHarvestDate: '2026-08-18',
//     expectedYieldKg: 3200,
//     actualYieldKg: 3050,
//     grade: 'A',
//     status: 'harvested',
//     notes: 'Good season, slight drought stress late.',
//   },
//   {
//     id: 'h-2',
//     cropId: 'crop-2',
//     cropName: 'Tomatoes',
//     cropCategory: 'Vegetable',
//     plantingDate: '2026-06-01',
//     expectedHarvestDate: '2026-09-20',
//     actualHarvestDate: null,
//     expectedYieldKg: 1800,
//     actualYieldKg: 0,
//     grade: null,
//     status: 'planted',
//     notes: 'Recently planted, growing well.',
//   },
//   {
//     id: 'h-3',
//     cropId: 'crop-4',
//     cropName: 'Pepper',
//     cropCategory: 'Vegetable',
//     plantingDate: '2026-05-15',
//     expectedHarvestDate: '2026-09-10',
//     actualHarvestDate: null,
//     expectedYieldKg: 2600,
//     actualYieldKg: 0,
//     grade: null,
//     status: 'ready',
//     notes: 'Ready for harvest, awaiting buyer.',
//   },
// ];

// export const orders: Order[] = [
//   {
//     id: 'o-1',
//     buyerName: 'Grace Adjei',
//     buyerCompany: 'Accra Fresh Foods Ltd',
//     cropName: 'Maize',
//     quantityKg: 2500,
//     unitPrice: 3.5,
//     status: 'confirmed',
//     createdAt: '2026-08-22T10:00:00Z',
//     totalValue: 8750,
//   },
//   {
//     id: 'o-2',
//     buyerName: 'Linda Agyemang',
//     buyerCompany: 'Green Bowl Restaurant Supply',
//     cropName: 'Pepper',
//     quantityKg: 800,
//     unitPrice: 4.0,
//     status: 'pending',
//     createdAt: '2026-08-26T14:00:00Z',
//     totalValue: 3200,
//   },
// ];

// export const deliveries: Delivery[] = [
//   {
//     id: 'd-1',
//     orderId: 'o-1',
//     cropName: 'Maize',
//     transporterName: 'Peter Adjei',
//     vehicleType: 'Cargo Truck',
//     pickupLocation: 'Kumasi, Ashanti',
//     deliveryLocation: 'Accra',
//     status: 'in_transit',
//     estimatedDelivery: '2026-08-28T18:00:00Z',
//     pickedUpAt: '2026-08-24T08:00:00Z',
//     deliveredAt: null,
//   },
// ];

// export const notifications: AppNotification[] = [
//   {
//     id: 'n-1',
//     type: 'order',
//     title: 'New Order Received',
//     message: 'Green Bowl Restaurant Supply wants to buy 800 kg of Pepper at $4.00/kg.',
//     timestamp: '2026-08-27T09:00:00Z',
//     read: false,
//   },
//   {
//     id: 'n-2',
//     type: 'delivery',
//     title: 'Delivery In Transit',
//     message: 'Your Maize delivery to Accra is on its way. ETA: Aug 28.',
//     timestamp: '2026-08-25T08:00:00Z',
//     read: false,
//   },
//   {
//     id: 'n-3',
//     type: 'harvest',
//     title: 'Harvest Reminder',
//     message: 'Your Pepper crop is ready for harvest. Schedule collection soon.',
//     timestamp: '2026-08-24T06:00:00Z',
//     read: true,
//   },
// ];

// // ─── Simulated API (replace with real Supabase/backend calls later) ───

// function delay(ms: number): Promise<void> {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// export const api = {
//   async getHarvests(): Promise<Harvest[]> {
//     await delay(300);
//     return [...harvests];
//   },

//   async getOrders(): Promise<Order[]> {
//     await delay(300);
//     return [...orders];
//   },

//   async getDeliveries(): Promise<Delivery[]> {
//     await delay(300);
//     return [...deliveries];
//   },

//   async getNotifications(): Promise<AppNotification[]> {
//     await delay(200);
//     return [...notifications];
//   },

//   async recordHarvest(data: {
//     cropId: string;
//     actualYieldKg: number;
//     grade: string;
//     notes: string;
//   }): Promise<Harvest> {
//     await delay(500);
//     const crop = crops.find((c) => c.id === data.cropId);
//     const newHarvest: Harvest = {
//       id: `h-${Date.now()}`,
//       cropId: data.cropId,
//       cropName: crop?.name ?? 'Unknown',
//       cropCategory: crop?.category ?? '',
//       plantingDate: new Date().toISOString().slice(0, 10),
//       expectedHarvestDate: new Date().toISOString().slice(0, 10),
//       actualHarvestDate: new Date().toISOString().slice(0, 10),
//       expectedYieldKg: data.actualYieldKg,
//       actualYieldKg: data.actualYieldKg,
//       grade: data.grade,
//       status: 'harvested',
//       notes: data.notes || null,
//     };
//     harvests.unshift(newHarvest);
//     return newHarvest;
//   },

//   async markNotificationRead(id: string): Promise<void> {
//     await delay(100);
//     const n = notifications.find((x) => x.id === id);
//     if (n) n.read = true;
//   },
// };


import type {
  Farmer,
  Crop,
  FarmerProduct,
  Harvest,
  Order,
  Delivery,
  AppNotification,
} from '@/types';

// ─── Mock data for the current farmer ──────────────────────────────

export const currentFarmer: Farmer = {
  id: 'farmer-1',
  name: 'Kwame Mensah',
  phone: '+233 24 555 0101',
  location: 'Kumasi, Ashanti',
  farmSizeHectares: 4.5,
  joinedDate: '2025-01-15',
  farmDescription:
    'Small-scale farmer producing maize, tomatoes and pepper.',
  profileImage: null,
};


// ─── Crop catalogue ────────────────────────────────────────────────

export const crops: Crop[] = [
  {
    id: 'crop-1',
    name: 'Maize',
    category: 'Grain',
    unit: 'kg',
  },
  {
    id: 'crop-2',
    name: 'Tomatoes',
    category: 'Vegetable',
    unit: 'kg',
  },
  {
    id: 'crop-3',
    name: 'Cassava',
    category: 'Tuber',
    unit: 'kg',
  },
  {
    id: 'crop-4',
    name: 'Pepper',
    category: 'Vegetable',
    unit: 'kg',
  },
  {
    id: 'crop-5',
    name: 'Yam',
    category: 'Tuber',
    unit: 'kg',
  },
];


// ─── Farmer products ────────────────────────────────────────────────
// Products currently being produced or sold by the farmer.

export const farmerProducts: FarmerProduct[] = [
  {
    id: 'product-1',
    farmerId: 'farmer-1',

    cropId: 'crop-1',
    cropName: 'Maize',
    category: 'Grain',

    variety: 'Hybrid Maize',
    unit: 'kg',

    quantityPlanted: 4000,
    expectedYield: 3500,
    availableQuantity: 3050,

    plantingDate: '2026-04-15',
    expectedHarvestDate: '2026-08-20',

    productionStage: 'harvested',
    readinessPercentage: 100,

    unitPrice: 3.5,
    minimumOrderQuantity: 100,

    description:
      'Quality maize harvested from our farm.',

    image: null,

    status: 'harvested',

    createdAt: '2026-04-15T08:00:00Z',
    updatedAt: '2026-08-18T10:00:00Z',
  },

  {
    id: 'product-2',
    farmerId: 'farmer-1',

    cropId: 'crop-2',
    cropName: 'Tomatoes',
    category: 'Vegetable',

    variety: 'Roma',
    unit: 'kg',

    quantityPlanted: 2000,
    expectedYield: 1800,
    availableQuantity: 0,

    plantingDate: '2026-06-01',
    expectedHarvestDate: '2026-09-20',

    productionStage: 'maturing',
    readinessPercentage: 65,

    unitPrice: 4.0,
    minimumOrderQuantity: 50,

    description:
      'Fresh tomatoes currently growing on the farm.',

    image: null,

    status: 'active',

    createdAt: '2026-06-01T08:00:00Z',
    updatedAt: '2026-08-25T10:00:00Z',
  },

  {
    id: 'product-3',
    farmerId: 'farmer-1',

    cropId: 'crop-4',
    cropName: 'Pepper',
    category: 'Vegetable',

    variety: 'Hot Pepper',
    unit: 'kg',

    quantityPlanted: 3000,
    expectedYield: 2600,
    availableQuantity: 2600,

    plantingDate: '2026-05-15',
    expectedHarvestDate: '2026-09-10',

    productionStage: 'ready',
    readinessPercentage: 95,

    unitPrice: 4.0,
    minimumOrderQuantity: 50,

    description:
      'Fresh pepper ready for harvest and buyer orders.',

    image: null,

    status: 'active',

    createdAt: '2026-05-15T08:00:00Z',
    updatedAt: '2026-08-27T10:00:00Z',
  },
];


// ─── Harvests ──────────────────────────────────────────────────────

export const harvests: Harvest[] = [
  {
    id: 'h-1',

    productId: 'product-1',
    cropId: 'crop-1',

    cropName: 'Maize',
    cropCategory: 'Grain',

    plantingDate: '2026-04-15',
    expectedHarvestDate: '2026-08-20',
    actualHarvestDate: '2026-08-18',

    expectedYieldKg: 3200,
    actualYieldKg: 3050,

    grade: 'A',

    status: 'harvested',

    notes:
      'Good season, slight drought stress late.',

    createdAt: '2026-08-18T10:00:00Z',
  },

  {
    id: 'h-2',

    productId: 'product-2',
    cropId: 'crop-2',

    cropName: 'Tomatoes',
    cropCategory: 'Vegetable',

    plantingDate: '2026-06-01',
    expectedHarvestDate: '2026-09-20',
    actualHarvestDate: null,

    expectedYieldKg: 1800,
    actualYieldKg: 0,

    grade: null,

    status: 'growing',

    notes:
      'Recently planted, growing well.',

    createdAt: '2026-06-01T08:00:00Z',
  },

  {
    id: 'h-3',

    productId: 'product-3',
    cropId: 'crop-4',

    cropName: 'Pepper',
    cropCategory: 'Vegetable',

    plantingDate: '2026-05-15',
    expectedHarvestDate: '2026-09-10',
    actualHarvestDate: null,

    expectedYieldKg: 2600,
    actualYieldKg: 0,

    grade: null,

    status: 'ready',

    notes:
      'Ready for harvest, awaiting buyer.',

    createdAt: '2026-05-15T08:00:00Z',
  },
];


// ─── Orders ────────────────────────────────────────────────────────
// Orders originate from the customer/web side.
// The farmer can approve or deny pending orders.

export const orders: Order[] = [
  {
    id: 'o-1',

    farmerId: 'farmer-1',

    buyerName: 'Grace Adjei',
    buyerCompany: 'Accra Fresh Foods Ltd',

    productId: 'product-1',
    cropName: 'Maize',

    quantityKg: 2500,
    unitPrice: 3.5,
    totalValue: 8750,

    status: 'approved',

    createdAt: '2026-08-22T10:00:00Z',

    denialReason: null,
    respondedAt: '2026-08-22T12:00:00Z',
  },

  {
    id: 'o-2',

    farmerId: 'farmer-1',

    buyerName: 'Linda Agyemang',
    buyerCompany: 'Green Bowl Restaurant Supply',

    productId: 'product-3',
    cropName: 'Pepper',

    quantityKg: 800,
    unitPrice: 4.0,
    totalValue: 3200,

    status: 'pending',

    createdAt: '2026-08-26T14:00:00Z',

    denialReason: null,
    respondedAt: null,
  },
];


// ─── Deliveries ───────────────────────────────────────────────────

export const deliveries: Delivery[] = [
  {
    id: 'd-1',

    orderId: 'o-1',

    cropName: 'Maize',

    transporterName: 'Peter Adjei',
    vehicleType: 'Cargo Truck',

    pickupLocation: 'Kumasi, Ashanti',
    deliveryLocation: 'Accra',

    status: 'in_transit',

    estimatedDelivery: '2026-08-28T18:00:00Z',

    pickedUpAt: '2026-08-24T08:00:00Z',
    deliveredAt: null,
  },
];


// ─── Notifications ────────────────────────────────────────────────

export const notifications: AppNotification[] = [
  {
    id: 'n-1',

    type: 'order',

    title: 'New Order Received',

    message:
      'Green Bowl Restaurant Supply wants to buy 800 kg of Pepper at $4.00/kg.',

    timestamp: '2026-08-27T09:00:00Z',

    read: false,
  },

  {
    id: 'n-2',

    type: 'delivery',

    title: 'Delivery In Transit',

    message:
      'Your Maize delivery to Accra is on its way. ETA: Aug 28.',

    timestamp: '2026-08-25T08:00:00Z',

    read: false,
  },

  {
    id: 'n-3',

    type: 'harvest',

    title: 'Harvest Reminder',

    message:
      'Your Pepper crop is ready for harvest. Schedule collection soon.',

    timestamp: '2026-08-24T06:00:00Z',

    read: true,
  },
];


// ─── Simulated API ─────────────────────────────────────────────────
// Temporary in-memory API.
// We will replace these functions with real backend calls later.

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


export const api = {

  // ─── Farmer ──────────────────────────────────────────────────────

  async getFarmer(): Promise<Farmer> {
    await delay(200);

    return {
      ...currentFarmer,
    };
  },


  async updateFarmer(
    data: Partial<Farmer>
  ): Promise<Farmer> {
    await delay(400);

    Object.assign(currentFarmer, data);

    return {
      ...currentFarmer,
    };
  },


  // ─── Products ────────────────────────────────────────────────────

  async getProducts(): Promise<FarmerProduct[]> {
    await delay(300);

    return [...farmerProducts];
  },


  async getProduct(
    id: string
  ): Promise<FarmerProduct | undefined> {
    await delay(200);

    return farmerProducts.find(
      (product) => product.id === id
    );
  },


  async createProduct(
    data: Omit<
      FarmerProduct,
      'id' | 'createdAt' | 'updatedAt'
    >
  ): Promise<FarmerProduct> {
    await delay(500);

    const now = new Date().toISOString();

    const newProduct: FarmerProduct = {
      ...data,

      id: `product-${Date.now()}`,

      createdAt: now,
      updatedAt: now,
    };

    farmerProducts.unshift(newProduct);

    return newProduct;
  },


  async updateProduct(
    id: string,
    data: Partial<FarmerProduct>
  ): Promise<FarmerProduct> {
    await delay(400);

    const product = farmerProducts.find(
      (item) => item.id === id
    );

    if (!product) {
      throw new Error('Product not found');
    }

    Object.assign(product, {
      ...data,
      updatedAt: new Date().toISOString(),
    });

    return {
      ...product,
    };
  },


  async deleteProduct(
    id: string
  ): Promise<void> {
    await delay(300);

    const index = farmerProducts.findIndex(
      (product) => product.id === id
    );

    if (index !== -1) {
      farmerProducts.splice(index, 1);
    }
  },


  // ─── Production ─────────────────────────────────────────────────

  async updateProductReadiness(
    id: string,
    readinessPercentage: number
  ): Promise<FarmerProduct> {
    await delay(300);

    const product = farmerProducts.find(
      (item) => item.id === id
    );

    if (!product) {
      throw new Error('Product not found');
    }

    product.readinessPercentage = Math.max(
      0,
      Math.min(100, readinessPercentage)
    );

    product.updatedAt =
      new Date().toISOString();

    return {
      ...product,
    };
  },


  async updateProductionStage(
    id: string,
    productionStage: FarmerProduct['productionStage']
  ): Promise<FarmerProduct> {
    await delay(300);

    const product = farmerProducts.find(
      (item) => item.id === id
    );

    if (!product) {
      throw new Error('Product not found');
    }

    product.productionStage =
      productionStage;

    product.updatedAt =
      new Date().toISOString();

    return {
      ...product,
    };
  },


  // ─── Harvests ────────────────────────────────────────────────────

  async getHarvests(): Promise<Harvest[]> {
    await delay(300);

    return [...harvests];
  },


  async recordHarvest(data: {
    productId: string;
    actualYieldKg: number;
    grade: string;
    notes: string;
  }): Promise<Harvest> {
    await delay(500);

    const product = farmerProducts.find(
      (item) => item.id === data.productId
    );

    if (!product) {
      throw new Error('Product not found');
    }

    const today = new Date()
      .toISOString()
      .slice(0, 10);

    const newHarvest: Harvest = {
      id: `h-${Date.now()}`,

      productId: product.id,
      cropId: product.cropId,

      cropName: product.cropName,
      cropCategory: product.category,

      plantingDate: product.plantingDate,
      expectedHarvestDate:
        product.expectedHarvestDate,

      actualHarvestDate: today,

      expectedYieldKg:
        product.expectedYield,

      actualYieldKg:
        data.actualYieldKg,

      grade: data.grade,

      status: 'harvested',

      notes:
        data.notes || null,

      createdAt:
        new Date().toISOString(),
    };

    harvests.unshift(newHarvest);

    // Update the farmer's product after harvest
    product.availableQuantity =
      data.actualYieldKg;

    product.readinessPercentage = 100;

    product.productionStage =
      'harvested';

    product.status =
      'harvested';

    product.updatedAt =
      new Date().toISOString();

    return newHarvest;
  },


  // ─── Orders ──────────────────────────────────────────────────────

  async getOrders(): Promise<Order[]> {
    await delay(300);

    return [...orders];
  },


  async getOrder(
    id: string
  ): Promise<Order | undefined> {
    await delay(200);

    return orders.find(
      (order) => order.id === id
    );
  },


  async approveOrder(
    id: string
  ): Promise<Order> {
    await delay(400);

    const order = orders.find(
      (item) => item.id === id
    );

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status !== 'pending') {
      throw new Error(
        'Only pending orders can be approved'
      );
    }

    // Check whether the farmer has enough product
    const product = farmerProducts.find(
      (item) => item.id === order.productId
    );

    if (!product) {
      throw new Error(
        'Product associated with this order was not found'
      );
    }

    if (
      product.availableQuantity <
      order.quantityKg
    ) {
      throw new Error(
        `Insufficient quantity. Available: ${product.availableQuantity} ${product.unit}`
      );
    }

    order.status = 'approved';

    order.respondedAt =
      new Date().toISOString();

    // Reserve the ordered quantity
    product.availableQuantity -=
      order.quantityKg;

    if (
      product.availableQuantity <= 0
    ) {
      product.availableQuantity = 0;
      product.status = 'sold_out';
    }

    product.updatedAt =
      new Date().toISOString();

    return {
      ...order,
    };
  },


  async denyOrder(
    id: string,
    reason: string
  ): Promise<Order> {
    await delay(400);

    const order = orders.find(
      (item) => item.id === id
    );

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status !== 'pending') {
      throw new Error(
        'Only pending orders can be denied'
      );
    }

    order.status = 'denied';

    order.denialReason =
      reason.trim() ||
      'Order denied by farmer';

    order.respondedAt =
      new Date().toISOString();

    return {
      ...order,
    };
  },


  // ─── Deliveries ─────────────────────────────────────────────────

  async getDeliveries(): Promise<Delivery[]> {
    await delay(300);

    return [...deliveries];
  },


  // ─── Notifications ──────────────────────────────────────────────

  async getNotifications(): Promise<AppNotification[]> {
    await delay(200);

    return [...notifications];
  },


  async markNotificationRead(
    id: string
  ): Promise<void> {
    await delay(100);

    const notification =
      notifications.find(
        (item) => item.id === id
      );

    if (notification) {
      notification.read = true;
    }
  },
};


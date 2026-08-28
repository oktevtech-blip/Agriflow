import type {
  Farmer,
  Crop,
  Harvest,
  Order,
  Delivery,
  AppNotification,
} from '@/types';

// ─── Mock data for the current farmer ───

export const currentFarmer: Farmer = {
  id: 'farmer-1',
  name: 'Kwame Mensah',
  phone: '+233 24 555 0101',
  location: 'Kumasi, Ashanti',
  farmSizeHectares: 4.5,
  joinedDate: '2025-01-15',
};

export const crops: Crop[] = [
  { id: 'crop-1', name: 'Maize', category: 'Grain', unit: 'kg' },
  { id: 'crop-2', name: 'Tomatoes', category: 'Vegetable', unit: 'kg' },
  { id: 'crop-3', name: 'Cassava', category: 'Tuber', unit: 'kg' },
  { id: 'crop-4', name: 'Pepper', category: 'Vegetable', unit: 'kg' },
  { id: 'crop-5', name: 'Yam', category: 'Tuber', unit: 'kg' },
];

export const harvests: Harvest[] = [
  {
    id: 'h-1',
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
    notes: 'Good season, slight drought stress late.',
  },
  {
    id: 'h-2',
    cropId: 'crop-2',
    cropName: 'Tomatoes',
    cropCategory: 'Vegetable',
    plantingDate: '2026-06-01',
    expectedHarvestDate: '2026-09-20',
    actualHarvestDate: null,
    expectedYieldKg: 1800,
    actualYieldKg: 0,
    grade: null,
    status: 'planted',
    notes: 'Recently planted, growing well.',
  },
  {
    id: 'h-3',
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
    notes: 'Ready for harvest, awaiting buyer.',
  },
];

export const orders: Order[] = [
  {
    id: 'o-1',
    buyerName: 'Grace Adjei',
    buyerCompany: 'Accra Fresh Foods Ltd',
    cropName: 'Maize',
    quantityKg: 2500,
    unitPrice: 3.5,
    status: 'confirmed',
    createdAt: '2026-08-22T10:00:00Z',
    totalValue: 8750,
  },
  {
    id: 'o-2',
    buyerName: 'Linda Agyemang',
    buyerCompany: 'Green Bowl Restaurant Supply',
    cropName: 'Pepper',
    quantityKg: 800,
    unitPrice: 4.0,
    status: 'pending',
    createdAt: '2026-08-26T14:00:00Z',
    totalValue: 3200,
  },
];

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

export const notifications: AppNotification[] = [
  {
    id: 'n-1',
    type: 'order',
    title: 'New Order Received',
    message: 'Green Bowl Restaurant Supply wants to buy 800 kg of Pepper at $4.00/kg.',
    timestamp: '2026-08-27T09:00:00Z',
    read: false,
  },
  {
    id: 'n-2',
    type: 'delivery',
    title: 'Delivery In Transit',
    message: 'Your Maize delivery to Accra is on its way. ETA: Aug 28.',
    timestamp: '2026-08-25T08:00:00Z',
    read: false,
  },
  {
    id: 'n-3',
    type: 'harvest',
    title: 'Harvest Reminder',
    message: 'Your Pepper crop is ready for harvest. Schedule collection soon.',
    timestamp: '2026-08-24T06:00:00Z',
    read: true,
  },
];

// ─── Simulated API (replace with real Supabase/backend calls later) ───

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const api = {
  async getHarvests(): Promise<Harvest[]> {
    await delay(300);
    return [...harvests];
  },

  async getOrders(): Promise<Order[]> {
    await delay(300);
    return [...orders];
  },

  async getDeliveries(): Promise<Delivery[]> {
    await delay(300);
    return [...deliveries];
  },

  async getNotifications(): Promise<AppNotification[]> {
    await delay(200);
    return [...notifications];
  },

  async recordHarvest(data: {
    cropId: string;
    actualYieldKg: number;
    grade: string;
    notes: string;
  }): Promise<Harvest> {
    await delay(500);
    const crop = crops.find((c) => c.id === data.cropId);
    const newHarvest: Harvest = {
      id: `h-${Date.now()}`,
      cropId: data.cropId,
      cropName: crop?.name ?? 'Unknown',
      cropCategory: crop?.category ?? '',
      plantingDate: new Date().toISOString().slice(0, 10),
      expectedHarvestDate: new Date().toISOString().slice(0, 10),
      actualHarvestDate: new Date().toISOString().slice(0, 10),
      expectedYieldKg: data.actualYieldKg,
      actualYieldKg: data.actualYieldKg,
      grade: data.grade,
      status: 'harvested',
      notes: data.notes || null,
    };
    harvests.unshift(newHarvest);
    return newHarvest;
  },

  async markNotificationRead(id: string): Promise<void> {
    await delay(100);
    const n = notifications.find((x) => x.id === id);
    if (n) n.read = true;
  },
};

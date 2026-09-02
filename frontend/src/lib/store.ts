import type { Farmer, Crop, Harvest, Buyer, Order, Transporter, Delivery } from '@/types';

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function daysAgo(n: number): string {
  return new Date(Date.now() - n * 86400000).toISOString();
}
function daysFromNow(n: number): string {
  return new Date(Date.now() + n * 86400000).toISOString();
}
function dateStr(d: string): string {
  return d.slice(0, 10);
}

// ─── Seed Data ───

const seedFarmers: Farmer[] = [
  {
    id: 'f1',
    name: 'Kwame Mensah',
    phone: '+233 24 555 0101',
    location: 'Kumasi, Ashanti',
    crop: 'Maize',
    created_at: daysAgo(120),
  },
  {
    id: 'f2',
    name: 'Ama Serwaa',
    phone: '+233 24 555 0102',
    location: 'Techiman, Bono East',
    crop: 'Cassava',
    created_at: daysAgo(110),
  },
  {
    id: 'f3',
    name: 'Yaw Boateng',
    phone: '+233 24 555 0103',
    location: 'Tamale, Northern',
    crop: 'Rice',
    created_at: daysAgo(100),
  },
  {
    id: 'f4',
    name: 'Akosua Asante',
    phone: '+233 24 555 0104',
    location: 'Ho, Volta',
    crop: 'Cocoa',
    created_at: daysAgo(90),
  },
  {
    id: 'f5',
    name: 'Kofi Owusu',
    phone: '+233 24 555 0105',
    location: 'Wa, Upper West',
    crop: 'Groundnuts',
    created_at: daysAgo(85),
  },
  {
    id: 'f6',
    name: 'Adwoa Nyame',
    phone: '+233 24 555 0106',
    location: 'Cape Coast, Central',
    crop: 'Plantain',
    created_at: daysAgo(80),
  },
  {
    id: 'f7',
    name: 'Ekow Mensah',
    phone: '+233 24 555 0107',
    location: 'Sunyani, Bono',
    crop: 'Yam',
    created_at: daysAgo(70),
  },
  {
    id: 'f8',
    name: 'Abena Dapaah',
    phone: '+233 24 555 0108',
    location: 'Bolgatanga, Upper East',
    crop: 'Soybeans',
    created_at: daysAgo(60),
  },
  {
    id: 'f9',
    name: 'Nana Yaw',
    phone: '+233 24 555 0109',
    location: 'Kintampo, Bono East',
    crop: 'Tomatoes',
    created_at: daysAgo(50),
  },
  {
    id: 'f10',
    name: 'Mansa Musa',
    phone: '+233 24 555 0110',
    location: 'Navrongo, Upper East',
    crop: 'Millet',
    created_at: daysAgo(40),
  },
];

const seedCrops: Crop[] = [
  { id: 'c1', name: 'Maize', category: 'Grain', unit: 'kg', created_at: daysAgo(200) },
  { id: 'c2', name: 'Rice', category: 'Grain', unit: 'kg', created_at: daysAgo(200) },
  { id: 'c3', name: 'Cassava', category: 'Tuber', unit: 'kg', created_at: daysAgo(200) },
  { id: 'c4', name: 'Yam', category: 'Tuber', unit: 'kg', created_at: daysAgo(200) },
  { id: 'c5', name: 'Tomatoes', category: 'Vegetable', unit: 'kg', created_at: daysAgo(200) },
  { id: 'c6', name: 'Onions', category: 'Vegetable', unit: 'kg', created_at: daysAgo(200) },
  { id: 'c7', name: 'Pepper', category: 'Vegetable', unit: 'kg', created_at: daysAgo(200) },
  { id: 'c8', name: 'Soybeans', category: 'Legume', unit: 'kg', created_at: daysAgo(200) },
  { id: 'c9', name: 'Groundnut', category: 'Legume', unit: 'kg', created_at: daysAgo(200) },
  { id: 'c10', name: 'Plantain', category: 'Fruit', unit: 'kg', created_at: daysAgo(200) },
];

const seedBuyers: Buyer[] = [
  { id: 'b1', name: 'Grace Adjei', phone: '+233 20 111 0001', company: 'Accra Fresh Foods Ltd', location: 'Accra', created_at: daysAgo(150) },
  { id: 'b2', name: 'Daniel Tetteh', phone: '+233 20 111 0002', company: 'Kumasi Grains Co-op', location: 'Kumasi', created_at: daysAgo(140) },
  { id: 'b3', name: 'Sarah Owusu', phone: '+233 20 111 0003', company: 'Takoradi Produce Market', location: 'Takoradi', created_at: daysAgo(130) },
  { id: 'b4', name: 'Michael Ankomah', phone: '+233 20 111 0004', company: 'AgroProcess Ghana', location: 'Tema', created_at: daysAgo(120) },
  { id: 'b5', name: 'Linda Agyemang', phone: '+233 20 111 0005', company: 'Green Bowl Restaurant Supply', location: 'Accra', created_at: daysAgo(100) },
];

const seedTransporters: Transporter[] = [
  { id: 't1', name: 'Samuel Kumi', phone: '+233 26 222 0001', vehicle_type: 'Pickup Truck', vehicle_plate: 'GR-2201', capacity_kg: 1200, created_at: daysAgo(180) },
  { id: 't2', name: 'Peter Adjei', phone: '+233 26 222 0002', vehicle_type: 'Cargo Truck', vehicle_plate: 'GR-2202', capacity_kg: 5000, created_at: daysAgo(180) },
  { id: 't3', name: 'John Frimpong', phone: '+233 26 222 0003', vehicle_type: 'Trailer', vehicle_plate: 'GR-2203', capacity_kg: 12000, created_at: daysAgo(180) },
  { id: 't4', name: 'Isaac Asante', phone: '+233 26 222 0004', vehicle_type: 'Van', vehicle_plate: 'GR-2204', capacity_kg: 800, created_at: daysAgo(180) },
];

const seedHarvests: Harvest[] = [
  { id: 'h1', farmer_id: 'f1', crop_id: 'c1', planting_date: '2026-04-15', expected_harvest_date: '2026-08-20', actual_harvest_date: '2026-08-18', expected_yield_kg: 3200, actual_yield_kg: 3050, grade: 'A', status: 'harvested', notes: 'Good season, slight drought stress late.', created_at: daysAgo(130) },
  { id: 'h2', farmer_id: 'f2', crop_id: 'c2', planting_date: '2026-05-01', expected_harvest_date: '2026-09-05', actual_harvest_date: null, expected_yield_kg: 5400, actual_yield_kg: 0, grade: null, status: 'growing', notes: 'Crop developing well.', created_at: daysAgo(120) },
  { id: 'h3', farmer_id: 'f3', crop_id: 'c8', planting_date: '2026-03-10', expected_harvest_date: '2026-07-15', actual_harvest_date: '2026-07-14', expected_yield_kg: 8200, actual_yield_kg: 7900, grade: 'A', status: 'harvested', notes: 'Excellent yield.', created_at: daysAgo(140) },
  { id: 'h4', farmer_id: 'f4', crop_id: 'c5', planting_date: '2026-06-01', expected_harvest_date: '2026-09-20', actual_harvest_date: null, expected_yield_kg: 1800, actual_yield_kg: 0, grade: null, status: 'planted', notes: 'Recently planted.', created_at: daysAgo(90) },
  { id: 'h5', farmer_id: 'f5', crop_id: 'c3', planting_date: '2026-04-20', expected_harvest_date: '2026-08-25', actual_harvest_date: '2026-08-22', expected_yield_kg: 4500, actual_yield_kg: 4300, grade: 'B', status: 'harvested', notes: 'Some pest damage.', created_at: daysAgo(125) },
  { id: 'h6', farmer_id: 'f6', crop_id: 'c7', planting_date: '2026-05-15', expected_harvest_date: '2026-09-10', actual_harvest_date: null, expected_yield_kg: 2600, actual_yield_kg: 0, grade: null, status: 'ready', notes: 'Ready for harvest.', created_at: daysAgo(105) },
  { id: 'h7', farmer_id: 'f7', crop_id: 'c4', planting_date: '2026-03-25', expected_harvest_date: '2026-07-30', actual_harvest_date: '2026-07-28', expected_yield_kg: 6100, actual_yield_kg: 6200, grade: 'A', status: 'harvested', notes: 'Above expectations.', created_at: daysAgo(155) },
  { id: 'h8', farmer_id: 'f8', crop_id: 'c9', planting_date: '2026-06-10', expected_harvest_date: '2026-10-01', actual_harvest_date: null, expected_yield_kg: 3900, actual_yield_kg: 0, grade: null, status: 'growing', notes: 'On track.', created_at: daysAgo(80) },
  { id: 'h9', farmer_id: 'f9', crop_id: 'c1', planting_date: '2026-04-05', expected_harvest_date: '2026-08-15', actual_harvest_date: '2026-08-13', expected_yield_kg: 9800, actual_yield_kg: 9500, grade: 'A', status: 'harvested', notes: 'Strong harvest.', created_at: daysAgo(135) },
  { id: 'h10', farmer_id: 'f10', crop_id: 'c6', planting_date: '2026-05-20', expected_harvest_date: '2026-09-15', actual_harvest_date: null, expected_yield_kg: 2200, actual_yield_kg: 0, grade: null, status: 'ready', notes: 'Ready, awaiting buyer.', created_at: daysAgo(100) },
];

const seedOrders: Order[] = [
  { id: 'o1', buyer_id: 'b1', crop_id: 'c1', farmer_id: 'f1', quantity_kg: 2500, unit_price: 3.50, status: 'confirmed', notes: null, created_at: daysAgo(5), confirmed_at: daysAgo(4), delivered_at: null },
  { id: 'o2', buyer_id: 'b2', crop_id: 'c2', farmer_id: 'f2', quantity_kg: 4000, unit_price: 2.80, status: 'confirmed', notes: null, created_at: daysAgo(3), confirmed_at: daysAgo(2), delivered_at: null },
  { id: 'o3', buyer_id: 'b3', crop_id: 'c3', farmer_id: null, quantity_kg: 1500, unit_price: 1.20, status: 'requested', notes: null, created_at: daysAgo(1), confirmed_at: null, delivered_at: null },
  { id: 'o4', buyer_id: 'b4', crop_id: 'c8', farmer_id: 'f3', quantity_kg: 6000, unit_price: 4.10, status: 'processing', notes: null, created_at: daysAgo(6), confirmed_at: daysAgo(5), delivered_at: null },
  { id: 'o5', buyer_id: 'b5', crop_id: 'c5', farmer_id: null, quantity_kg: 800, unit_price: 2.00, status: 'requested', notes: null, created_at: daysAgo(0), confirmed_at: null, delivered_at: null },
];

const seedDeliveries: Delivery[] = [
  { id: 'd1', order_id: 'o1', transporter_id: 't2', pickup_location: 'Kumasi, Ashanti', delivery_location: 'Accra', status: 'in_transit', assigned_at: daysAgo(4), picked_up_at: daysAgo(3), in_transit_at: daysAgo(2), delivered_at: null, estimated_delivery: daysFromNow(1), created_at: daysAgo(4) },
  { id: 'd2', order_id: 'o2', transporter_id: 't1', pickup_location: 'Techiman, Bono East', delivery_location: 'Kumasi', status: 'assigned', assigned_at: daysAgo(1), picked_up_at: null, in_transit_at: null, delivered_at: null, estimated_delivery: daysFromNow(3), created_at: daysAgo(1) },
  { id: 'd3', order_id: 'o4', transporter_id: 't3', pickup_location: 'Sunyani, Bono', delivery_location: 'Tema', status: 'delivered', assigned_at: daysAgo(5), picked_up_at: daysAgo(4), in_transit_at: daysAgo(3), delivered_at: daysAgo(1), estimated_delivery: daysAgo(1), created_at: daysAgo(5) },
];

// ─── In-memory store ───

class DataStore {
  farmers: Farmer[] = seedFarmers.map((f) => ({ ...f }));
  crops: Crop[] = seedCrops.map((c) => ({ ...c }));
  harvests: Harvest[] = seedHarvests.map((h) => ({ ...h }));
  buyers: Buyer[] = seedBuyers.map((b) => ({ ...b }));
  orders: Order[] = seedOrders.map((o) => ({ ...o }));
  transporters: Transporter[] = seedTransporters.map((t) => ({ ...t }));
  deliveries: Delivery[] = seedDeliveries.map((d) => ({ ...d }));

  private listeners = new Set<() => void>();

  subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  // ── Helpers to resolve joins ──
  private resolveHarvest(h: Harvest): Harvest {
    return {
      ...h,
      farmer: this.farmers.find((f) => f.id === h.farmer_id),
      crop: this.crops.find((c) => c.id === h.crop_id),
    };
  }

  private resolveOrder(o: Order): Order {
    return {
      ...o,
      buyer: this.buyers.find((b) => b.id === o.buyer_id),
      crop: this.crops.find((c) => c.id === o.crop_id),
      farmer: o.farmer_id ? this.farmers.find((f) => f.id === o.farmer_id) : undefined,
    };
  }

  private resolveDelivery(d: Delivery): Delivery {
    const order = this.orders.find((o) => o.id === d.order_id);
    return {
      ...d,
      order: order ? this.resolveOrder(order) : undefined,
      transporter: this.transporters.find((t) => t.id === d.transporter_id),
    };
  }

  // ── Reads ──
  getFarmers(): Farmer[] { return this.farmers.map((f) => ({ ...f })); }
  getCrops(): Crop[] { return this.crops.map((c) => ({ ...c })); }
  getHarvests(): Harvest[] { return this.harvests.map((h) => this.resolveHarvest(h)); }
  getBuyers(): Buyer[] { return this.buyers.map((b) => ({ ...b })); }
  getOrders(): Order[] { return this.orders.map((o) => this.resolveOrder(o)); }
  getTransporters(): Transporter[] { return this.transporters.map((t) => ({ ...t })); }
  getDeliveries(): Delivery[] { return this.deliveries.map((d) => this.resolveDelivery(d)); }

  // ── Writes ──
  addBuyer(data: Omit<Buyer, 'id' | 'created_at'>): Buyer {
    const buyer: Buyer = { ...data, id: uid(), created_at: new Date().toISOString() };
    this.buyers.push(buyer);
    this.notify();
    return buyer;
  }

  addFarmer(data: Omit<Farmer, 'id' | 'created_at'>): Farmer {
    const farmer: Farmer = { ...data, id: uid(), created_at: new Date().toISOString() };
    this.farmers.push(farmer);
    this.notify();
    return farmer;
  }

  addHarvest(data: {
    farmer_id: string;
    crop_id: string;
    planting_date: string;
    expected_harvest_date: string | null;
    expected_yield_kg: number;
    status: Harvest['status'];
    notes: string | null;
  }): Harvest {
    const harvest: Harvest = {
      ...data,
      id: uid(),
      actual_harvest_date: data.status === 'harvested' ? dateStr(new Date().toISOString()) : null,
      actual_yield_kg: 0,
      grade: null,
      created_at: new Date().toISOString(),
    };
    this.harvests.push(harvest);
    this.notify();
    return harvest;
  }

  addOrder(data: {
    buyer_id: string;
    crop_id: string;
    quantity_kg: number;
    unit_price: number;
    notes: string | null;
  }): Order {
    const order: Order = {
      ...data,
      id: uid(),
      farmer_id: null,
      status: 'requested',
      created_at: new Date().toISOString(),
      confirmed_at: null,
      delivered_at: null,
    };
    this.orders.push(order);
    this.notify();
    return order;
  }

  assignFarmer(orderId: string, farmerId: string): void {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return;
    order.farmer_id = farmerId;
    order.status = 'pending';
    this.notify();
  }

  confirmOrder(orderId: string): void {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return;
    order.status = 'confirmed';
    order.confirmed_at = new Date().toISOString();
    this.notify();
  }

  updateOrder(id: string, updates: Partial<Order>): void {
    const order = this.orders.find((o) => o.id === id);
    if (!order) return;
    Object.assign(order, updates);
    this.notify();
  }

  addDelivery(data: {
    order_id: string;
    transporter_id: string;
    pickup_location: string | null;
    delivery_location: string | null;
    estimated_delivery: string | null;
  }): Delivery {
    const delivery: Delivery = {
      ...data,
      id: uid(),
      status: 'assigned',
      assigned_at: new Date().toISOString(),
      picked_up_at: null,
      in_transit_at: null,
      delivered_at: null,
      created_at: new Date().toISOString(),
    };
    this.deliveries.push(delivery);
    // Also update the order status to in_transit
    this.updateOrder(data.order_id, { status: 'in_transit' });
    return delivery;
  }

  updateDelivery(id: string, updates: Partial<Delivery>): void {
    const delivery = this.deliveries.find((d) => d.id === id);
    if (!delivery) return;
    Object.assign(delivery, updates);
    // If delivery is delivered, also mark the order as delivered
    if (updates.status === 'delivered') {
      this.updateOrder(delivery.order_id, { status: 'delivered', delivered_at: new Date().toISOString() });
    }
    this.notify();
  }
}

export const store = new DataStore();

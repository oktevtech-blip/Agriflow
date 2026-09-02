export type HarvestStatus = 'planted' | 'growing' | 'ready' | 'harvested';
export type OrderStatus = 'requested' | 'pending' | 'confirmed' | 'processing' | 'in_transit' | 'delivered' | 'cancelled';
export type DeliveryStatus = 'assigned' | 'pickup' | 'in_transit' | 'delivered';

export interface Farmer {
  id: string;
  name: string;
  phone: string | null;
  location: string;
  farm_size_hectares: number;
  created_at: string;
}

export interface Crop {
  id: string;
  name: string;
  category: string;
  unit: string;
  created_at: string;
}

export interface Harvest {
  id: string;
  farmer_id: string;
  crop_id: string;
  planting_date: string;
  expected_harvest_date: string | null;
  actual_harvest_date: string | null;
  expected_yield_kg: number;
  actual_yield_kg: number;
  grade: string | null;
  status: HarvestStatus;
  notes: string | null;
  created_at: string;
  // joined
  farmer?: Farmer;
  crop?: Crop;
}

export interface Buyer {
  id: string;
  name: string;
  phone: string | null;
  company: string | null;
  location: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  buyer_id: string;
  crop_id: string;
  farmer_id: string | null;
  quantity_kg: number;
  unit_price: number;
  status: OrderStatus;
  notes: string | null;
  created_at: string;
  confirmed_at: string | null;
  delivered_at: string | null;
  // joined
  buyer?: Buyer;
  crop?: Crop;
  farmer?: Farmer;
}

export interface Transporter {
  id: string;
  name: string;
  phone: string | null;
  vehicle_type: string | null;
  vehicle_plate: string | null;
  capacity_kg: number;
  created_at: string;
}

export interface Delivery {
  id: string;
  order_id: string;
  transporter_id: string;
  pickup_location: string | null;
  delivery_location: string | null;
  status: DeliveryStatus;
  assigned_at: string;
  picked_up_at: string | null;
  in_transit_at: string | null;
  delivered_at: string | null;
  estimated_delivery: string | null;
  created_at: string;
  // joined
  order?: Order;
  transporter?: Transporter;
}

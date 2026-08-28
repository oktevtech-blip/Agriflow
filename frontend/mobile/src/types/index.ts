export type HarvestStatus = 'planted' | 'growing' | 'ready' | 'harvested';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'in_transit' | 'delivered' | 'cancelled';
export type DeliveryStatus = 'assigned' | 'pickup' | 'in_transit' | 'delivered';

export interface Farmer {
  id: string;
  name: string;
  phone: string;
  location: string;
  farmSizeHectares: number;
  joinedDate: string;
}

export interface Crop {
  id: string;
  name: string;
  category: string;
  unit: string;
}

export interface Harvest {
  id: string;
  cropId: string;
  cropName: string;
  cropCategory: string;
  plantingDate: string;
  expectedHarvestDate: string;
  actualHarvestDate: string | null;
  expectedYieldKg: number;
  actualYieldKg: number;
  grade: string | null;
  status: HarvestStatus;
  notes: string | null;
}

export interface Order {
  id: string;
  buyerName: string;
  buyerCompany: string;
  cropName: string;
  quantityKg: number;
  unitPrice: number;
  status: OrderStatus;
  createdAt: string;
  totalValue: number;
}

export interface Delivery {
  id: string;
  orderId: string;
  cropName: string;
  transporterName: string;
  vehicleType: string;
  pickupLocation: string;
  deliveryLocation: string;
  status: DeliveryStatus;
  estimatedDelivery: string;
  pickedUpAt: string | null;
  deliveredAt: string | null;
}

export interface AppNotification {
  id: string;
  type: 'order' | 'harvest' | 'delivery' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// import type { HarvestStatus, OrderStatus, DeliveryStatus } from '@/types';

// export const HARVEST_STATUS_META: Record<HarvestStatus, { label: string; color: string; dot: string }> = {
//   planted: { label: 'Planted', color: 'bg-earth-100 text-earth-700', dot: 'bg-earth-400' },
//   growing: { label: 'Growing', color: 'bg-sky-100 text-sky-700', dot: 'bg-sky-500' },
//   ready: { label: 'Ready', color: 'bg-sun-100 text-sun-600', dot: 'bg-sun-500' },
//   harvested: { label: 'Harvested', color: 'bg-brand-100 text-brand-700', dot: 'bg-brand-500' },
// };

// export const ORDER_STATUS_META: Record<OrderStatus, { label: string; color: string; dot: string }> = {
//   pending: { label: 'Pending', color: 'bg-earth-100 text-earth-700', dot: 'bg-earth-400' },
//   confirmed: { label: 'Confirmed', color: 'bg-sky-100 text-sky-700', dot: 'bg-sky-500' },
//   processing: { label: 'Processing', color: 'bg-sun-100 text-sun-600', dot: 'bg-sun-500' },
//   in_transit: { label: 'In Transit', color: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-500' },
//   delivered: { label: 'Delivered', color: 'bg-brand-100 text-brand-700', dot: 'bg-brand-500' },
//   cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
// };

// export const DELIVERY_STATUS_META: Record<DeliveryStatus, { label: string; color: string; dot: string }> = {
//   assigned: { label: 'Assigned', color: 'bg-earth-100 text-earth-700', dot: 'bg-earth-400' },
//   pickup: { label: 'Pickup', color: 'bg-sun-100 text-sun-600', dot: 'bg-sun-500' },
//   in_transit: { label: 'In Transit', color: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-500' },
//   delivered: { label: 'Delivered', color: 'bg-brand-100 text-brand-700', dot: 'bg-brand-500' },
// };

// export const ORDER_FLOW: OrderStatus[] = ['pending', 'confirmed', 'processing', 'in_transit', 'delivered'];
// export const DELIVERY_FLOW: DeliveryStatus[] = ['assigned', 'pickup', 'in_transit', 'delivered'];



import type { HarvestStatus, OrderStatus, DeliveryStatus } from '@/types';

export const HARVEST_STATUS_META: Record<
  HarvestStatus,
  { label: string; color: string; dot: string }
> = {
  planted: {
    label: 'Planted',
    color: 'bg-earth-100 text-earth-700',
    dot: 'bg-earth-400',
  },

  growing: {
    label: 'Growing',
    color: 'bg-sky-100 text-sky-700',
    dot: 'bg-sky-500',
  },

  ready: {
    label: 'Ready',
    color: 'bg-sun-100 text-sun-600',
    dot: 'bg-sun-500',
  },

  harvested: {
    label: 'Harvested',
    color: 'bg-brand-100 text-brand-700',
    dot: 'bg-brand-500',
  },
};

export const ORDER_STATUS_META: Record<
  OrderStatus,
  { label: string; color: string; dot: string }
> = {
  requested: {
    label: 'Requested',
    color: 'bg-amber-100 text-amber-700',
    dot: 'bg-amber-500',
  },

  pending: {
    label: 'Pending',
    color: 'bg-earth-100 text-earth-700',
    dot: 'bg-earth-400',
  },

  confirmed: {
    label: 'Confirmed',
    color: 'bg-sky-100 text-sky-700',
    dot: 'bg-sky-500',
  },

  processing: {
    label: 'Processing',
    color: 'bg-sun-100 text-sun-600',
    dot: 'bg-sun-500',
  },

  in_transit: {
    label: 'In Transit',
    color: 'bg-indigo-100 text-indigo-700',
    dot: 'bg-indigo-500',
  },

  delivered: {
    label: 'Delivered',
    color: 'bg-brand-100 text-brand-700',
    dot: 'bg-brand-500',
  },

  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-700',
    dot: 'bg-red-500',
  },
};

export const DELIVERY_STATUS_META: Record<
  DeliveryStatus,
  { label: string; color: string; dot: string }
> = {
  assigned: {
    label: 'Assigned',
    color: 'bg-earth-100 text-earth-700',
    dot: 'bg-earth-400',
  },

  pickup: {
    label: 'Pickup',
    color: 'bg-sun-100 text-sun-600',
    dot: 'bg-sun-500',
  },

  in_transit: {
    label: 'In Transit',
    color: 'bg-indigo-100 text-indigo-700',
    dot: 'bg-indigo-500',
  },

  delivered: {
    label: 'Delivered',
    color: 'bg-brand-100 text-brand-700',
    dot: 'bg-brand-500',
  },
};

export const ORDER_FLOW: OrderStatus[] = [
  'requested',
  'pending',
  'confirmed',
  'processing',
  'in_transit',
  'delivered',
];

export const DELIVERY_FLOW: DeliveryStatus[] = [
  'assigned',
  'pickup',
  'in_transit',
  'delivered',
];


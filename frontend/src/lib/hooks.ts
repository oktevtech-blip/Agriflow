import { useEffect, useState, useSyncExternalStore } from 'react';
import { store } from '@/lib/store';
import type { Farmer, Crop, Harvest, Buyer, Order, Transporter, Delivery } from '@/types';

export interface AgriData {
  farmers: Farmer[];
  crops: Crop[];
  harvests: Harvest[];
  buyers: Buyer[];
  orders: Order[];
  transporters: Transporter[];
  deliveries: Delivery[];
}

export function useAgriData(): { data: AgriData; loading: boolean; error: string | null } {
  const subscribe = (cb: () => void) => store.subscribe(cb);
  const getSnapshot = () => {
    // Return a stable reference that only changes when the store notifies
    return storeSnapshot;
  };

  // useSyncExternalStore triggers re-render when store notifies
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  // Always read fresh data from store on every render
  return {
    data: {
      farmers: store.getFarmers(),
      crops: store.getCrops(),
      harvests: store.getHarvests(),
      buyers: store.getBuyers(),
      orders: store.getOrders(),
      transporters: store.getTransporters(),
      deliveries: store.getDeliveries(),
    },
    loading: false,
    error: null,
  };
}

// A stable snapshot reference — the actual data is read from the store directly.
// useSyncExternalStore just needs this to be referentially stable.
const storeSnapshot = 0;

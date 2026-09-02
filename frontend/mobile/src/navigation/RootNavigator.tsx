import React from 'react';
import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Home,
  Sprout,
  ShoppingBag,
  Truck,
  Bell,
} from 'lucide-react-native';

import { theme } from '@/theme';

import { HomeScreen } from '@/screens/HomeScreen';
import { FarmScreen } from '@/screens/FarmScreen';
import { OrdersScreen } from '@/screens/OrdersScreen';
import { DeliveriesScreen } from '@/screens/DeliveriesScreen';
import { NotificationsScreen } from '@/screens/NotificationsScreen';
import { RecordHarvestScreen } from '@/screens/RecordHarvestScreen';
import { OrderDetailScreen } from '@/screens/OrderDetailScreen';
import { DeliveryDetailScreen } from '@/screens/DeliveryDetailScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  RecordHarvest: undefined;
  OrderDetail: { orderId: string };
  DeliveryDetail: { deliveryId: string };
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export type TabParamList = {
  Home: undefined;
  Farm: undefined;
  Orders: undefined;
  Deliveries: undefined;
  Notifications: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

/*
 * Wrapper for screens inside the bottom-tab navigator.
 *
 * Android can render the app underneath the status bar when
 * edge-to-edge mode is enabled. This makes the screen content
 * respect the phone's top safe area.
 */
function SafeTabScreen({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
      edges={['top']}
    >
      {children}
    </SafeAreaView>
  );
}

function HomeTab() {
  return (
    <SafeTabScreen>
      <HomeScreen />
    </SafeTabScreen>
  );
}

function FarmTab() {
  return (
    <SafeTabScreen>
      <FarmScreen />
    </SafeTabScreen>
  );
}

function OrdersTab() {
  return (
    <SafeTabScreen>
      <OrdersScreen />
    </SafeTabScreen>
  );
}

function DeliveriesTab() {
  return (
    <SafeTabScreen>
      <DeliveriesScreen />
    </SafeTabScreen>
  );
}

function NotificationsTab() {
  return (
    <SafeTabScreen>
      <NotificationsScreen />
    </SafeTabScreen>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: theme.colors.brand[600],
        tabBarInactiveTintColor: theme.colors.earth[400],

        tabBarStyle: {
          backgroundColor: theme.colors.white,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          paddingBottom: 4,
          paddingTop: 4,
          height: 60,
        },

        tabBarLabelStyle: {
          fontSize: theme.fontSize.xs,
          fontWeight: theme.fontWeight.semibold,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeTab}
        options={{
          tabBarIcon: ({ color }) => (
            <Home size={22} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Farm"
        component={FarmTab}
        options={{
          tabBarIcon: ({ color }) => (
            <Sprout size={22} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Orders"
        component={OrdersTab}
        options={{
          tabBarIcon: ({ color }) => (
            <ShoppingBag size={22} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Deliveries"
        component={DeliveriesTab}
        options={{
          tabBarIcon: ({ color }) => (
            <Truck size={22} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Notifications"
        component={NotificationsTab}
        options={{
          tabBarIcon: ({ color }) => (
            <Bell size={22} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.white,
        },

        headerTitleStyle: {
          fontWeight: theme.fontWeight.bold,
          fontSize: theme.fontSize.lg,
        },

        headerTintColor: theme.colors.textPrimary,

        headerShadowVisible: false,

        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="RecordHarvest"
        component={RecordHarvestScreen}
        options={{
          title: 'Record Harvest',
        }}
      />

      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{
          title: 'Order Details',
        }}
      />

      <Stack.Screen
        name="DeliveryDetail"
        component={DeliveryDetailScreen}
        options={{
          title: 'Delivery',
        }}
      />

      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
        }}
      />
    </Stack.Navigator>
  );
}
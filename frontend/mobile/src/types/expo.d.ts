/// <reference types="expo/types" />

import { ExpoConfig } from 'expo/config';

declare module 'expo/config' {
  interface ExpoConfig {
    plugins?: any[];
  }
}

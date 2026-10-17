// src/lib/platform.ts
import { Capacitor } from '@capacitor/core';

export function isNativeApp(): boolean {
  try {
    if (Capacitor.isNativePlatform()) return true;
    if (typeof window !== 'undefined') {
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        return true;
      }
      if ((window.navigator as unknown as { standalone?: boolean })?.standalone === true) {
        return true;
      }
    }
  } catch {
    // Ignore error
  }
  return false;
}

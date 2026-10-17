import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fitrun.app',
  appName: 'FitRun',
  webDir: 'dist',
  server: {
    url: 'https://fit-run-silk.vercel.app',
    cleartext: true,
    androidScheme: 'https'
  }
};

export default config;

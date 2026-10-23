import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    browserName: 'chromium',
    headless: true,
    screenshot: 'on',
    trace: 'retain-on-failure',
  },
});


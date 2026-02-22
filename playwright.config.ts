import { defineConfig } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

function hasTestFiles(dir: string): boolean {
  if (!fs.existsSync(dir)) return false;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && hasTestFiles(fullPath)) return true;
    if (entry.isFile() && entry.name.endsWith(".spec.ts")) return true;
  }
  return false;
}

const hasTests = hasTestFiles("e2e");

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
  ...(hasTests && {
    webServer: {
      command: "bin/rails server -p 3000",
      url: "http://localhost:3000",
      reuseExistingServer: !process.env.CI,
    },
  }),
});

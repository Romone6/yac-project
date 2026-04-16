import { chromium, type Browser, type Page } from "playwright";
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "fs";
import { dirname } from "path";

const DELAY_MS = 2000;
const MAX_RETRIES = 3;

let browser: Browser | null = null;

export async function getBrowser(): Promise<Browser> {
  if (!browser) {
    browser = await chromium.launch({ headless: true });
  }
  return browser;
}

export async function closeBrowser(): Promise<void> {
  if (browser) {
    await browser.close();
    browser = null;
  }
}

export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  retries: number = MAX_RETRIES
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      const waitTime = Math.pow(2, i) * 1000;
      console.log(`  Retry ${i + 1}/${retries}, waiting ${waitTime}ms...`);
      await delay(waitTime);
    }
  }
  throw new Error("Max retries exceeded");
}

export async function safeNavigate(
  page: Page,
  url: string
): Promise<boolean> {
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await delay(DELAY_MS);
    return true;
  } catch (error) {
    console.error(`  Failed to navigate to ${url}:`, error);
    return false;
  }
}

export function writeJson(filePath: string, data: unknown): void {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`  Written: ${filePath}`);
}

export function readJson<T>(filePath: string): T | null {
  try {
    const content = readFileSync(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function extractText(
  element: Element | null,
  selector: string
): string {
  if (!element) return "";
  const el = element.querySelector(selector);
  return el?.textContent?.trim() || "";
}

export function extractAllText(
  element: Element | null,
  selector: string
): string[] {
  if (!element) return [];
  return Array.from(element.querySelectorAll(selector))
    .map((el) => el.textContent?.trim())
    .filter(Boolean) as string[];
}

export async function waitForContent(
  page: Page,
  selector: string,
  timeout: number = 15000
): Promise<boolean> {
  try {
    await page.waitForSelector(selector, { state: "visible", timeout });
    return true;
  } catch {
    return false;
  }
}

export function log(message: string, level: "info" | "error" | "success" = "info"): void {
  const prefix = level === "error" ? "❌" : level === "success" ? "✅" : "ℹ️";
  console.log(`${prefix} ${message}`);
}

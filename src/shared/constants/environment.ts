export const ENVIRONMENT = {
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  SESSION_SECRET: process.env.SESSION_SECRET || process.env.AUTH_SECRET || "",
  SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME || "chrono_session",
  SESSION_MAX_AGE: Number(process.env.SESSION_MAX_AGE ?? 60 * 60 * 8),
  DEBOUNCE_TIME: Number(process.env.NEXT_PUBLIC_DEBOUNCE_TIME ?? 300),
  PRINTER_NAME: process.env.NEXT_PUBLIC_PRINTER_NAME || "EPSON",
  PRINTER_API_URL:
    process.env.NEXT_PUBLIC_PRINTER_API_URL || "http://localhost:4000",
  COOKIE_SECURE:
    process.env.NEXT_PUBLIC_COOKIE_SECURE === "true" ? "true" : "false",
};

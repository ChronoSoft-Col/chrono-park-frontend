/**
 * Normalizes a Colombian license plate string:
 * trims, uppercases, and strips non-alphanumeric characters.
 */
export function normalizePlate(value: string): string {
  return value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

/**
 * Validates whether a string matches a valid Colombian license plate format.
 *
 * Supported formats:
 * - Car:              ABC123  (3 letters + 3 digits)
 * - Motorcycle:       ABC12D  (3 letters + 2 digits + 1 letter)
 * - Diplomatic / old: ABC12   (3 letters + 2 digits)
 */
export function isValidColombianPlate(plate: string): boolean {
  if (!plate) return false;
  return (
    /^[A-Z]{3}\d{3}$/.test(plate) ||
    /^[A-Z]{3}\d{2}[A-Z]$/.test(plate) ||
    /^[A-Z]{3}\d{2}$/.test(plate)
  );
}

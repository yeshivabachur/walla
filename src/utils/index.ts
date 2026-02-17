/**
 * Canonical page URL generator for our router.
 *
 * - Router paths are PascalCase (e.g., /DriverAnalytics).
 * - Historically, some code generated lowercase slugs; we now standardize.
 */
export function createPageUrl(pageName: string): string {
  const cleaned = pageName.trim();
  if (!cleaned) return "/";
  // If caller already provided a path, respect it.
  if (cleaned.startsWith("/")) return cleaned;

  // Convert "Driver Analytics" -> "DriverAnalytics"
  const pascal = cleaned.replace(/\s+/g, "");
  return `/${pascal}`;
}

/**
 * Helper to ensure static asset URLs resolve properly whether running:
 * 1. Locally on /
 * 2. On GitHub Pages with base /FACEDERMA/
 * 3. In Cloud preview environments
 */
export function getAssetUrl(pathStr: string | undefined | null): string {
  if (!pathStr) return '';
  
  // Data URLs, Blobs, and external absolute HTTP URLs are returned as-is
  if (
    pathStr.startsWith('http://') ||
    pathStr.startsWith('https://') ||
    pathStr.startsWith('data:') ||
    pathStr.startsWith('blob:')
  ) {
    return pathStr;
  }

  // Vite automatically replaces import.meta.env.BASE_URL with the configured base (e.g. '/FACEDERMA/')
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;

  // If the path already starts with the cleanBase, do not duplicate it
  if (cleanBase !== '/' && pathStr.startsWith(cleanBase)) {
    return pathStr;
  }

  // Strip leading slash if any before appending to cleanBase
  const cleanPath = pathStr.startsWith('/') ? pathStr.slice(1) : pathStr;
  return `${cleanBase}${cleanPath}`;
}

export default getAssetUrl;

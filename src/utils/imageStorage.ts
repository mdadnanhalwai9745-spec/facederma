/**
 * High-Capacity Persistent Image Storage
 * Combines IndexedDB (unlimited capacity) + Server disk persistence (/api/save-image) + localStorage fallback.
 * Prevents the 5MB browser quota crash that causes hero and product images to disappear on reload.
 */

const DB_NAME = 'FaceDermaMediaStore_v1';
const STORE_NAME = 'images';
const DB_VERSION = 1;

// Image keys
export const STORAGE_KEYS = {
  HERO_SLIDE: (slideId: number) => `hero_slide_${slideId}`,
  PRODUCT: (productId: string) => `product_${productId}`,
  PHILOSOPHY_MODEL: 'philosophy_model_photo',
  FD_SHIELD_BANNER: 'banner_fd_shield',
};

// Open or initialize IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported in this environment'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Optimizes an uploaded image using an offscreen canvas:
 * - Resizes dimensions to max width/height suitable for high-res retina displays (max 2048px).
 * - Converts to optimized WebP (or high-quality JPEG if WebP isn't supported).
 * - Reduces file size from 5-15MB down to ~200-400KB with crystal-clear fidelity.
 */
export async function optimizeImage(
  fileOrDataUrl: File | string,
  maxWidth = 2048,
  maxHeight = 1200,
  quality = 0.88
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        let { width, height } = img;

        // Calculate aspect-ratio preserved downscale
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          // Fallback to original
          return resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : img.src);
        }

        // High quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first, fallback to JPEG
        let optimized = canvas.toDataURL('image/webp', quality);
        if (!optimized.startsWith('data:image/webp')) {
          optimized = canvas.toDataURL('image/jpeg', quality);
        }
        resolve(optimized);
      } catch (err) {
        console.warn('Image optimization fallback:', err);
        resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : img.src);
      }
    };

    img.onerror = () => {
      resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');
    };

    if (typeof fileOrDataUrl === 'string') {
      img.src = fileOrDataUrl;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = (e.target?.result as string) || '';
      };
      reader.readAsDataURL(fileOrDataUrl);
    }
  });
}

/**
 * Save image with multi-tier persistence:
 * 1. IndexedDB (primary high-capacity store, avoids 5MB quota crash)
 * 2. Server Disk API (/api/save-image -> public/uploads)
 * 3. localStorage (safely guarded with try/catch)
 */
export async function savePersistentImage(key: string, rawDataUrl: string): Promise<string> {
  if (!rawDataUrl) return '';

  // 1. Optimize size
  const optimizedDataUrl = await optimizeImage(rawDataUrl);

  // 2. Save to IndexedDB (virtually unlimited quota)
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(optimizedDataUrl, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (idbErr) {
    console.warn('IndexedDB save warning:', idbErr);
  }

  // 3. Save to server disk if API is available (creates permanent file in public/uploads/)
  try {
    const res = await fetch('/api/save-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, dataUrl: optimizedDataUrl }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.url) {
        // If server stored it, also record server URL
        try {
          localStorage.setItem(`url_${key}`, json.url);
        } catch {
          // ignore
        }
      }
    }
  } catch {
    // Dev server API might be starting or not available
  }

  // 4. Safe localStorage attempt for quick instant load
  try {
    localStorage.setItem(`cached_${key}`, optimizedDataUrl);
  } catch {
    // If quota exceeded, do not delete existing keys! IndexedDB and server disk already safely persist the image.
  }

  // Notify components across windows/tabs
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('facederma_image_updated', { detail: { key, url: optimizedDataUrl } }));
    window.dispatchEvent(new Event('storage'));
  }

  return optimizedDataUrl;
}

// Candidate static file paths for hero slides and featured banners when deployed or saved directly to /public
const STATIC_HERO_CANDIDATES: Record<string, string[]> = {
  hero_slide_1: ['/uploads/hero_slide_1.webp'],
  hero_slide_2: ['/uploads/hero_slide_2.webp'],
  hero_slide_3: ['/uploads/hero_slide_3.webp'],
  hero_slide_4: ['/uploads/hero_slide_4.webp'],
  banner_fd_shield: ['/banners/fd-shield-banner.webp', '/uploads/banner_fd_shield.webp'],
};

function isBannedImage(_url: string | null | undefined): boolean {
  return false;
}

function verifyImageAvailable(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

/**
 * Retrieve persistent image from the best available source:
 * 1. Fast memory / localStorage cache
 * 2. IndexedDB (guaranteed persistent store)
 * 3. Server public URL (/uploads/ or /hero/)
 * 4. Known candidate static files in /public
 */
export async function getPersistentImage(key: string): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  // 1. Fast localStorage check
  try {
    const cached = localStorage.getItem(`cached_${key}`);
    if (cached) {
      if (isBannedImage(cached)) {
        localStorage.removeItem(`cached_${key}`);
      } else {
        return cached;
      }
    }
    const serverUrl = localStorage.getItem(`url_${key}`);
    if (serverUrl) {
      if (isBannedImage(serverUrl)) {
        localStorage.removeItem(`url_${key}`);
      } else {
        return serverUrl;
      }
    }
  } catch {
    // ignore
  }

  // 2. IndexedDB check
  try {
    const db = await openDB();
    const data = await new Promise<string | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
    if (data) {
      if (isBannedImage(data)) {
        removePersistentImage(key).catch(() => {});
        return null;
      }
      // Re-populate localStorage if possible
      try {
        localStorage.setItem(`cached_${key}`, data);
      } catch {
        // ignore
      }
      return data;
    }
  } catch (idbErr) {
    console.warn('IndexedDB read warning:', idbErr);
  }

  // 3. Server API check
  try {
    const res = await fetch('/api/all-images');
    if (res.ok) {
      const all = await res.json();
      if (all[key]) {
        return all[key];
      }
    }
  } catch {
    // ignore
  }

  // 4. Candidate static files check (for static deployed builds)
  if (STATIC_HERO_CANDIDATES[key]) {
    for (const candidate of STATIC_HERO_CANDIDATES[key]) {
      try {
        const available = await verifyImageAvailable(candidate);
        if (available) {
          try {
            localStorage.setItem(`url_${key}`, candidate);
          } catch {
            // ignore
          }
          return candidate;
        }
      } catch {
        // ignore
      }
    }
  }

  return null;
}

/**
 * Remove an image from all persistence tiers
 */
export async function removePersistentImage(key: string): Promise<void> {
  try {
    localStorage.removeItem(`cached_${key}`);
    localStorage.removeItem(`url_${key}`);
  } catch {
    // ignore
  }

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // ignore
  }

  try {
    await fetch('/api/delete-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key }),
    });
  } catch {
    // ignore
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('facederma_image_updated', { detail: { key, url: '' } }));
    window.dispatchEvent(new Event('storage'));
  }
}

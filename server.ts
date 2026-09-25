import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const PORT = Number(process.env.PORT) || 3000;
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'products', 'permanent');
const ALT_UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'products', 'permanent');
const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_DATA_FILE = path.join(DATA_DIR, 'server-products.json');

// Ensure storage directories exist
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
if (!fs.existsSync(ALT_UPLOADS_DIR)) {
  fs.mkdirSync(ALT_UPLOADS_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

async function startServer() {
  const app = express();

  // Support high-resolution image uploads up to 100MB
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ limit: '100mb', extended: true }));

  // API 1: Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', serverTime: new Date().toISOString() });
  });

  // API 2: Get permanent products manifest for all worldwide visitors
  app.get('/api/products', (_req, res) => {
    try {
      if (fs.existsSync(PRODUCTS_DATA_FILE)) {
        const raw = fs.readFileSync(PRODUCTS_DATA_FILE, 'utf-8');
        return res.json({ success: true, products: JSON.parse(raw) });
      }
      return res.json({ success: true, products: null });
    } catch (e: any) {
      console.error('Error reading products data:', e);
      return res.status(500).json({ error: e.message });
    }
  });

  // API 3: Upload a single product image or catalog permanently to disk
  app.post('/api/products/upload', (req, res) => {
    try {
      const { productId, imageBase64, isCatalog } = req.body;
      if (!productId) {
        return res.status(400).json({ error: 'productId is required' });
      }

      const keyId = isCatalog ? `${productId}_catalog` : productId;

      // Handle deletion / reset
      if (req.body.delete || imageBase64 === '') {
        let currentMap: Record<string, string> = {};
        if (fs.existsSync(PRODUCTS_DATA_FILE)) {
          try {
            currentMap = JSON.parse(fs.readFileSync(PRODUCTS_DATA_FILE, 'utf-8'));
          } catch {
            currentMap = {};
          }
        }
        delete currentMap[keyId];
        fs.writeFileSync(PRODUCTS_DATA_FILE, JSON.stringify(currentMap, null, 2));
        return res.json({ success: true, removed: keyId, allImages: currentMap });
      }

      if (!imageBase64) {
        return res.status(400).json({ error: 'imageBase64 is required' });
      }

      // If already a URL, record it in currentMap and return
      if (typeof imageBase64 === 'string' && (imageBase64.startsWith('/') || imageBase64.startsWith('http'))) {
        let currentMap: Record<string, string> = {};
        if (fs.existsSync(PRODUCTS_DATA_FILE)) {
          try {
            currentMap = JSON.parse(fs.readFileSync(PRODUCTS_DATA_FILE, 'utf-8'));
          } catch {
            currentMap = {};
          }
        }
        currentMap[keyId] = imageBase64;
        fs.writeFileSync(PRODUCTS_DATA_FILE, JSON.stringify(currentMap, null, 2));
        return res.json({ success: true, message: 'Updated URL mapping', permanentUrl: imageBase64, allImages: currentMap });
      }

      // Parse mime type & base64 payload cleanly
      let ext = 'webp';
      let buffer: Buffer;

      if (typeof imageBase64 === 'string' && imageBase64.includes(';base64,')) {
        const commaIdx = imageBase64.indexOf(',');
        const meta = imageBase64.substring(0, commaIdx).toLowerCase();
        if (meta.includes('jpeg') || meta.includes('jpg')) ext = 'jpg';
        else if (meta.includes('png')) ext = 'png';
        else if (meta.includes('webp')) ext = 'webp';
        else if (meta.includes('svg')) ext = 'svg';
        else if (meta.includes('pdf')) ext = 'pdf';
        buffer = Buffer.from(imageBase64.substring(commaIdx + 1), 'base64');
      } else if (typeof imageBase64 === 'string') {
        const commaIdx = imageBase64.indexOf(',');
        const raw = commaIdx >= 0 ? imageBase64.substring(commaIdx + 1) : imageBase64;
        buffer = Buffer.from(raw, 'base64');
      } else {
        return res.status(400).json({ error: 'Invalid image data' });
      }

      if (buffer.length < 50) {
        return res.status(400).json({ error: 'Image buffer too small or corrupt' });
      }

      const safeFileName = `${keyId}.${ext}`;
      const filePath = path.join(UPLOADS_DIR, safeFileName);
      fs.writeFileSync(filePath, buffer);

      // Write duplicate to ALT_UPLOADS_DIR for legacy compatibility
      try {
        fs.writeFileSync(path.join(ALT_UPLOADS_DIR, safeFileName), buffer);
      } catch {
        // secondary backup
      }

      // If this is a hero banner, also write directly to public/hero/
      if (keyId.includes('hero') || keyId === 'hero_banner') {
        try {
          const heroDir = path.join(process.cwd(), 'public', 'hero');
          if (!fs.existsSync(heroDir)) fs.mkdirSync(heroDir, { recursive: true });
          fs.writeFileSync(path.join(heroDir, 'slide-1.webp'), buffer);
          fs.writeFileSync(path.join(heroDir, 'slide-2.webp'), buffer);
          const distHeroDir = path.join(process.cwd(), 'dist', 'hero');
          if (fs.existsSync(distHeroDir)) {
            fs.writeFileSync(path.join(distHeroDir, 'slide-1.webp'), buffer);
            fs.writeFileSync(path.join(distHeroDir, 'slide-2.webp'), buffer);
          }
        } catch (e) {
          console.error('Error saving hero banner to hero directory:', e);
        }
      }

      const permanentUrl = `/products/permanent/${safeFileName}?t=${Date.now()}`;

      // Update server-products.json
      let currentMap: Record<string, string> = {};
      if (fs.existsSync(PRODUCTS_DATA_FILE)) {
        try {
          currentMap = JSON.parse(fs.readFileSync(PRODUCTS_DATA_FILE, 'utf-8'));
        } catch {
          currentMap = {};
        }
      }
      currentMap[keyId] = permanentUrl;
      fs.writeFileSync(PRODUCTS_DATA_FILE, JSON.stringify(currentMap, null, 2));

      console.log(`[Permanent Storage] Saved ${keyId} permanently to ${filePath} (${buffer.length} bytes)`);

      return res.json({
        success: true,
        productId,
        keyId,
        permanentUrl,
        size: buffer.length,
        allImages: currentMap,
      });
    } catch (e: any) {
      console.error('Error saving permanent product image or catalog:', e);
      return res.status(500).json({ error: e.message });
    }
  });

  // API 4: Bulk permanent image upload for products and catalogs
  app.post('/api/products/bulk-upload', (req, res) => {
    try {
      const { items } = req.body; // Array of { productId, imageBase64, isCatalog, filename }
      if (!Array.isArray(items)) {
        return res.status(400).json({ error: 'items array is required' });
      }

      let currentMap: Record<string, string> = {};
      if (fs.existsSync(PRODUCTS_DATA_FILE)) {
        try {
          currentMap = JSON.parse(fs.readFileSync(PRODUCTS_DATA_FILE, 'utf-8'));
        } catch {
          currentMap = {};
        }
      }

      const results = [];

      for (const item of items) {
        const { productId, imageBase64, isCatalog, isSecondary } = item;
        if (!productId || !imageBase64) continue;

        const keyId = (isCatalog || isSecondary) ? `${productId}_catalog` : productId;

        if (typeof imageBase64 === 'string' && (imageBase64.startsWith('/') || imageBase64.startsWith('http'))) {
          currentMap[keyId] = imageBase64;
          results.push({ productId, keyId, permanentUrl: imageBase64 });
          continue;
        }

        let ext = 'webp';
        let buffer: Buffer;

        if (typeof imageBase64 === 'string' && imageBase64.includes(';base64,')) {
          const commaIdx = imageBase64.indexOf(',');
          const meta = imageBase64.substring(0, commaIdx).toLowerCase();
          if (meta.includes('jpeg') || meta.includes('jpg')) ext = 'jpg';
          else if (meta.includes('png')) ext = 'png';
          else if (meta.includes('webp')) ext = 'webp';
          else if (meta.includes('svg')) ext = 'svg';
          buffer = Buffer.from(imageBase64.substring(commaIdx + 1), 'base64');
        } else if (typeof imageBase64 === 'string' && imageBase64.length > 100) {
          const commaIdx = imageBase64.indexOf(',');
          const raw = commaIdx >= 0 ? imageBase64.substring(commaIdx + 1) : imageBase64;
          buffer = Buffer.from(raw, 'base64');
        } else {
          continue;
        }

        if (buffer.length < 50) continue;

        const safeFileName = `${keyId}.${ext}`;
        const filePath = path.join(UPLOADS_DIR, safeFileName);
        fs.writeFileSync(filePath, buffer);

        try {
          fs.writeFileSync(path.join(ALT_UPLOADS_DIR, safeFileName), buffer);
        } catch {
          // secondary backup
        }

        const permanentUrl = `/products/permanent/${safeFileName}?t=${Date.now()}`;
        currentMap[keyId] = permanentUrl;
        results.push({ productId, keyId, permanentUrl, size: buffer.length });
      }

      fs.writeFileSync(PRODUCTS_DATA_FILE, JSON.stringify(currentMap, null, 2));

      console.log(`[Permanent Storage] Bulk saved ${results.length} items permanently to disk`);

      return res.json({
        success: true,
        savedCount: results.length,
        results,
        allImages: currentMap,
      });
    } catch (e: any) {
      console.error('Error in bulk upload:', e);
      return res.status(500).json({ error: e.message });
    }
  });

  // API 5: General persistent key-value image storage endpoint
  app.post('/api/save-image', (req, res) => {
    try {
      const { key } = req.body;
      const data = req.body.data || req.body.dataUrl || req.body.imageBase64;
      if (!key) return res.status(400).json({ error: 'Key is required' });

      const storeFile = path.join(DATA_DIR, 'persistent-store.json');
      let store: Record<string, string> = {};
      if (fs.existsSync(storeFile)) {
        try {
          store = JSON.parse(fs.readFileSync(storeFile, 'utf-8'));
        } catch {
          store = {};
        }
      }
      if (data) {
        store[key] = data;

        // If this is a hero slide/banner, also extract base64 buffer and write to permanent storage
        if (typeof data === 'string' && (key.includes('hero') || key === 'banner_fd_shield')) {
          try {
            const commaIdx = data.indexOf(',');
            const raw = commaIdx >= 0 ? data.substring(commaIdx + 1) : data;
            const buf = Buffer.from(raw, 'base64');
            if (buf.length > 50) {
              const permDir = path.join(process.cwd(), 'public', 'products', 'permanent');
              if (!fs.existsSync(permDir)) fs.mkdirSync(permDir, { recursive: true });
              fs.writeFileSync(path.join(permDir, 'hero_banner.webp'), buf);
              fs.writeFileSync(path.join(permDir, 'hero_banner.jpg'), buf);

              const distPermDir = path.join(process.cwd(), 'dist', 'products', 'permanent');
              if (fs.existsSync(distPermDir)) {
                fs.writeFileSync(path.join(distPermDir, 'hero_banner.webp'), buf);
                fs.writeFileSync(path.join(distPermDir, 'hero_banner.jpg'), buf);
              }

              const heroDir = path.join(process.cwd(), 'public', 'hero');
              if (!fs.existsSync(heroDir)) fs.mkdirSync(heroDir, { recursive: true });
              fs.writeFileSync(path.join(heroDir, 'hero_banner.webp'), buf);

              // Also record in server-products.json for instant worldwide loading across all devices
              if (fs.existsSync(PRODUCTS_DATA_FILE)) {
                try {
                  const pMap = JSON.parse(fs.readFileSync(PRODUCTS_DATA_FILE, 'utf-8'));
                  pMap.hero_banner = `/products/permanent/hero_banner.webp?t=${Date.now()}`;
                  fs.writeFileSync(PRODUCTS_DATA_FILE, JSON.stringify(pMap, null, 2));
                  console.log('[Server] Recorded hero_banner in server-products.json');
                } catch (e) {
                  console.error('Error writing to server-products.json:', e);
                }
              }
            }
          } catch (err) {
            console.error('Error writing hero file from save-image:', err);
          }
        }
      } else {
        delete store[key];
      }
      fs.writeFileSync(storeFile, JSON.stringify(store, null, 2));
      return res.json({ success: true, key });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  });

  // Dedicated API for instant Hero Banner upload across all devices
  app.post('/api/hero/upload', (req, res) => {
    try {
      const { imageBase64 } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: 'imageBase64 is required' });
      }

      let buffer: Buffer;
      let ext = 'webp';
      if (typeof imageBase64 === 'string' && imageBase64.includes(';base64,')) {
        const commaIdx = imageBase64.indexOf(',');
        const meta = imageBase64.substring(0, commaIdx).toLowerCase();
        if (meta.includes('jpeg') || meta.includes('jpg')) ext = 'jpg';
        else if (meta.includes('png')) ext = 'png';
        buffer = Buffer.from(imageBase64.substring(commaIdx + 1), 'base64');
      } else if (typeof imageBase64 === 'string') {
        const commaIdx = imageBase64.indexOf(',');
        const raw = commaIdx >= 0 ? imageBase64.substring(commaIdx + 1) : imageBase64;
        buffer = Buffer.from(raw, 'base64');
      } else {
        return res.status(400).json({ error: 'Invalid payload' });
      }

      if (buffer.length < 50) {
        return res.status(400).json({ error: 'Image file too small' });
      }

      const permDir = path.join(process.cwd(), 'public', 'products', 'permanent');
      if (!fs.existsSync(permDir)) fs.mkdirSync(permDir, { recursive: true });
      fs.writeFileSync(path.join(permDir, `hero_banner.${ext}`), buffer);
      fs.writeFileSync(path.join(permDir, 'hero_banner.webp'), buffer);
      fs.writeFileSync(path.join(permDir, 'hero_banner.jpg'), buffer);

      const distPermDir = path.join(process.cwd(), 'dist', 'products', 'permanent');
      if (fs.existsSync(distPermDir)) {
        fs.writeFileSync(path.join(distPermDir, `hero_banner.${ext}`), buffer);
        fs.writeFileSync(path.join(distPermDir, 'hero_banner.webp'), buffer);
        fs.writeFileSync(path.join(distPermDir, 'hero_banner.jpg'), buffer);
      }

      const heroUrl = `/products/permanent/hero_banner.${ext}?t=${Date.now()}`;

      // Update server-products.json
      let pMap: Record<string, string> = {};
      if (fs.existsSync(PRODUCTS_DATA_FILE)) {
        try {
          pMap = JSON.parse(fs.readFileSync(PRODUCTS_DATA_FILE, 'utf-8'));
        } catch {
          pMap = {};
        }
      }
      pMap.hero_banner = heroUrl;
      fs.writeFileSync(PRODUCTS_DATA_FILE, JSON.stringify(pMap, null, 2));

      console.log(`[Server] Hero banner permanently saved (${buffer.length} bytes) to ${heroUrl}`);
      return res.json({ success: true, heroUrl, size: buffer.length });
    } catch (err: any) {
      console.error('Error uploading hero banner:', err);
      return res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/get-image/:key', (req, res) => {
    try {
      const storeFile = path.join(DATA_DIR, 'persistent-store.json');
      if (fs.existsSync(storeFile)) {
        const store = JSON.parse(fs.readFileSync(storeFile, 'utf-8'));
        return res.json({ success: true, data: store[req.params.key] || null });
      }
      return res.json({ success: true, data: null });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  });

  // API 6: Return all globally persisted images across the site
  app.get('/api/all-images', (_req, res) => {
    try {
      const combined: Record<string, string> = {};

      // 1. Persistent key-value store
      const storeFile = path.join(DATA_DIR, 'persistent-store.json');
      if (fs.existsSync(storeFile)) {
        try {
          const store = JSON.parse(fs.readFileSync(storeFile, 'utf-8'));
          Object.assign(combined, store);
        } catch {
          // ignore
        }
      }

      // 2. Server products map (product images and catalog sheets)
      const productsFile = path.join(DATA_DIR, 'server-products.json');
      if (fs.existsSync(productsFile)) {
        try {
          const prods = JSON.parse(fs.readFileSync(productsFile, 'utf-8'));
          Object.assign(combined, prods);
        } catch {
          // ignore
        }
      }

      // 3. Scan permanent folder if anything was saved directly
      if (fs.existsSync(UPLOADS_DIR)) {
        const files = fs.readdirSync(UPLOADS_DIR);
        for (const file of files) {
          const baseName = path.parse(file).name;
          if (!combined[baseName]) {
            combined[baseName] = `/products/permanent/${file}`;
          }
        }
      }

      return res.json(combined);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  });

  // Serve static assets from public/ and dist/
  app.use(express.static(path.join(process.cwd(), 'public')));
  app.use('/products', express.static(path.join(process.cwd(), 'public', 'products')));
  app.use('/FACEDERMA', express.static(path.join(process.cwd(), 'public')));
  app.use('/FACEDERMA/products', express.static(path.join(process.cwd(), 'public', 'products')));
  const distProducts = path.join(process.cwd(), 'dist', 'products');
  if (fs.existsSync(distProducts)) {
    app.use('/products', express.static(distProducts));
    app.use('/FACEDERMA/products', express.static(distProducts));
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    app.use((req, _res, next) => {
      if (req.url === '/') {
        req.url = '/FACEDERMA/';
      }
      next();
    });
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use('/FACEDERMA', express.static(distPath));
    app.use(express.static(distPath));
    // In production, prevent missing assets from returning index.html
    app.use((req, res, next) => {
      if (/\.(png|jpe?g|webp|gif|svg|ico|css|js|map)$/i.test(req.path)) {
        return res.status(404).end();
      }
      next();
    });
    app.get(['*', '/FACEDERMA/*'], (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[FaceDerma Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

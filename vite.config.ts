import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';

function imageUploadPlugin(): Plugin {
  return {
    name: 'image-upload-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith('/api/save-image') && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const { key, dataUrl } = JSON.parse(body);
              if (key && dataUrl) {
                const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
                const buffer = Buffer.from(base64Data, 'base64');
                
                const uploadDir = path.resolve(import.meta.dirname, 'public/uploads');
                const heroDir = path.resolve(import.meta.dirname, 'public/hero');
                const bannersDir = path.resolve(import.meta.dirname, 'public/banners');
                if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
                if (!fs.existsSync(heroDir)) fs.mkdirSync(heroDir, { recursive: true });
                if (!fs.existsSync(bannersDir)) fs.mkdirSync(bannersDir, { recursive: true });

                const safeKey = String(key).replace(/[^a-zA-Z0-9_-]/g, '_');
                const filePath = path.join(uploadDir, `${safeKey}.webp`);
                fs.writeFileSync(filePath, buffer);

                // If this is a hero slide (e.g. hero_slide_1), also write permanent slide file
                const heroMatch = safeKey.match(/hero_slide_(\d+)/);
                let finalUrl = `/uploads/${safeKey}.webp?t=${Date.now()}`;
                if (heroMatch) {
                  const slideId = heroMatch[1];
                  const heroPath = path.join(heroDir, `slide-${slideId}.webp`);
                  fs.writeFileSync(heroPath, buffer);
                  finalUrl = `/hero/slide-${slideId}.webp?t=${Date.now()}`;
                }

                if (safeKey.includes('banner') || safeKey.includes('fd_shield')) {
                  const bannerPath = path.join(bannersDir, 'fd-shield-banner.webp');
                  fs.writeFileSync(bannerPath, buffer);
                  finalUrl = `/banners/fd-shield-banner.webp?t=${Date.now()}`;
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, url: finalUrl }));
                return;
              }
            } catch (err) {
              console.error('Error saving image in dev middleware:', err);
            }
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to save image' }));
          });
          return;
        }

        if (req.url?.startsWith('/api/all-images') && req.method === 'GET') {
          try {
            const uploadDir = path.resolve(import.meta.dirname, 'public/uploads');
            const heroDir = path.resolve(import.meta.dirname, 'public/hero');
            const publicDir = path.resolve(import.meta.dirname, 'public');
            const result: Record<string, string> = {};

            // Check uploads
            if (fs.existsSync(uploadDir)) {
              const files = fs.readdirSync(uploadDir);
              for (const file of files) {
                const key = path.parse(file).name;
                result[key] = `/uploads/${file}`;
              }
            }

            // Check hero directory
            if (fs.existsSync(heroDir)) {
              const files = fs.readdirSync(heroDir);
              for (const file of files) {
                const match = file.match(/slide-(\d+)/);
                if (match) {
                  result[`hero_slide_${match[1]}`] = `/hero/${file}`;
                }
              }
            }

            // Also check standard filenames in public
            const knownFallbacks: Record<string, string> = {
              '1.webp': 'hero_slide_1',
              '2 (2).jpg': 'hero_slide_2',
              '2.jpg': 'hero_slide_2',
              '3.webp': 'hero_slide_3',
              '4.webp': 'hero_slide_4',
              'Gemini_Generated_Image_v7xko9v7xko9v7xk.jpg': 'hero_slide_4'
            };

            for (const [fname, k] of Object.entries(knownFallbacks)) {
              if (fs.existsSync(path.join(publicDir, fname)) && !result[k]) {
                result[k] = `/${encodeURIComponent(fname)}`;
              }
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
            return;
          } catch (e) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to read images' }));
            return;
          }
        }

        if (req.url?.startsWith('/api/delete-image') && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const { key } = JSON.parse(body);
              if (key) {
                const safeKey = String(key).replace(/[^a-zA-Z0-9_-]/g, '_');
                const filePath = path.join(path.resolve(import.meta.dirname, 'public/uploads'), `${safeKey}.webp`);
                if (fs.existsSync(filePath)) {
                  fs.unlinkSync(filePath);
                }
                const heroMatch = safeKey.match(/hero_slide_(\d+)/);
                if (heroMatch) {
                  const heroPath = path.join(path.resolve(import.meta.dirname, 'public/hero'), `slide-${heroMatch[1]}.webp`);
                  if (fs.existsSync(heroPath)) {
                    fs.unlinkSync(heroPath);
                  }
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
                return;
              }
            } catch (err) {
              console.error('Error deleting image:', err);
            }
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to delete image' }));
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    base: '/facederma/',
    plugins: [react(), tailwindcss(), imageUploadPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});


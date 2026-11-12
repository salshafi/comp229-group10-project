import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In dev, any request to /api is forwarded to the Express server,
// so the browser never sees a cross-origin request.
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:4000' } },
});

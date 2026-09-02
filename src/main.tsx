import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Automatic cache invalidation if build timestamp changed
if (typeof window !== 'undefined') {
  try {
    const storedBuildTs = localStorage.getItem('autofolio_build_ts');
    if (typeof __BUILD_TIMESTAMP__ !== 'undefined') {
      if (storedBuildTs && storedBuildTs !== __BUILD_TIMESTAMP__) {
        console.log(`🚀 Nueva versión detectada (${__BUILD_TIMESTAMP__}). Actualizando caché...`);
        if ('caches' in window) {
          caches.keys().then((names) => {
            for (const name of names) {
              caches.delete(name);
            }
          });
        }
      }
      localStorage.setItem('autofolio_build_ts', __BUILD_TIMESTAMP__);
    }
  } catch {
    // Ignore storage issues in restricted iframes
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

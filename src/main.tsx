import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App';
import { I18nProvider } from '@/i18n/I18nProvider';
import '@/index.css';

// Al activarse un service worker nuevo (nueva version desplegada), recarga una vez
// para que la PWA instalada no se quede sirviendo el build anterior.
if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading) return;
    reloading = true;
    window.location.reload();
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>,
);

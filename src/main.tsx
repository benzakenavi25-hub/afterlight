import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Self-hosted fonts (OFL). unicode-range limits downloads to the subsets actually used.
import '@fontsource/noto-serif-hebrew/300.css';
import '@fontsource/noto-serif-hebrew/400.css';
import '@fontsource/heebo/300.css';
import '@fontsource/heebo/400.css';
import '@fontsource/heebo/500.css';
import '@fontsource/cormorant-garamond/latin-400.css';
import '@fontsource/cormorant-garamond/latin-500.css';
// One weight, used only for the exterior-reveal lettering (SVG mask)
import '@fontsource/cormorant-garamond/latin-700.css';

import './styles/tokens.css';
import './styles/base.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

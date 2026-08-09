import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { captureAttribution } from './booking/attribution'
import { captureFbclid } from './booking/fb'

// Capture UTM attribution + fbclid at boot, before SPA navigation can clear
// the query string.
captureAttribution()
captureFbclid()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

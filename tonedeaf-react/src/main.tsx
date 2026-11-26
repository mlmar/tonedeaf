import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

const url = new URL(window.location.href)

if (url.hostname === 'localhost') {
  // Spotify's local callback and the app must share the same cookie host.
  url.hostname = '127.0.0.1'
  window.location.replace(url.href)
} else {
  const root = document.getElementById('root')

  if (!root) {
    throw new Error('Missing the tonedeaf root element')
  }

  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

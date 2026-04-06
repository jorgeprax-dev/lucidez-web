import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import posthog from 'posthog-js'
import './index.css'
import App from './App.jsx'

posthog.init('phc_wryEhDEJRXwUaFCs9FiakzRcW4unmBbBU3oaBfTj3z6W', {
  api_host: 'https://us.i.posthog.com',
  person_profiles: 'identified_only',
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>,
)
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import { ClerkProvider } from '@clerk/react'

const PUBlISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBlISHABLE_KEY) {
  throw new Error('Missing Clerk publishable key.')
}

createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={PUBlISHABLE_KEY}>
     <BrowserRouter>
        <App />
      </BrowserRouter>
  </ClerkProvider>
)
 


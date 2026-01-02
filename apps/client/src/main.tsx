import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { AuthProvider } from './lib/AuthContext'
import { CartProvider } from './lib/CartContext'
import { TripProvider } from './lib/TripContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TripProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </TripProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

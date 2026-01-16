import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { ErrorBoundary } from './presentation/components/common/ErrorBoundary'
import App from './App.jsx'
import { initializeMercadoPago } from './infrastructure/config/mercadopago.init.js'

// Inicializar Mercado Pago SDK
initializeMercadoPago()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)

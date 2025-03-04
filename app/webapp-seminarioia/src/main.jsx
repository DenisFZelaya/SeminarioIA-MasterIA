import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react';

const domain = "dev-fcdyqr0j.us.auth0.com"; // Reemplaza con tu dominio de Auth0
const clientId = "6D1NGnl8iTl9lgTx0QALsiUzez9Hxd9k";  // Reemplaza con tu Client ID de Auth0


createRoot(document.getElementById('root')).render(

  <StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>,
)

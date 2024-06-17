import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react';


ReactDOM.createRoot(document.getElementById('root')).render(

  <Auth0Provider
    domain="dev-0zzghy8r0u5uw6sl.us.auth0.com"
    clientId="EvmQWbTN8dWSIfQHk63KKs7Afq3CSEh5"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Auth0Provider>
)

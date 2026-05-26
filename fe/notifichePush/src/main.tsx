import { createRoot } from "react-dom/client"
import { StrictMode } from "react"

import App from "./App"
import keycloak from "./components/keycloak"

import { AuthProvider } from "@/components/context/auth"
import { ThemeProvider } from "@/components/theme-provider"
import { BrowserRouter } from "react-router-dom"
import "./index.css"

keycloak
  .init({
    onLoad: "login-required",
    checkLoginIframe: false,
    pkceMethod: "S256",
  })
  .then((authenticated) => {
    if (!authenticated) {
      keycloak.login()
      return
    }

    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <AuthProvider>
          <ThemeProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ThemeProvider>
        </AuthProvider>
      </StrictMode>
    )
  })
  .catch((err) => {
    console.error("Keycloak init failed:", err)
  })
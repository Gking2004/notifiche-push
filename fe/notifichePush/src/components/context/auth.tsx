import * as React from "react"
import keycloak from "@/components/keycloak"
import { useEffect } from "react"
import { registerDeviceWithBackend } from "@/utils/notifications"
import { onMessage } from "firebase/messaging"
import { messaging } from "@/config/firebase"

interface AuthContextType {
  username: string | null
  firstname: string | null
  lastname: string | null
  email: string | null
  token: string | null
  isAuthenticated: boolean
  fcmToken: string | null
  login: () => void
  logout: () => void
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)

  const [username, setUsername] = React.useState<string | null>(null)
  const [firstname, setFirstname] = React.useState<string | null>(null)
  const [lastname, setLastname] = React.useState<string | null>(null)
  const [email, setEmail] = React.useState<string | null>(null)
  const [token, setToken] = React.useState<string | null>(null)
  const [fcmToken, setFcmToken] = React.useState<string | null>(null)


  const syncAuth = React.useCallback(() => {
    const auth = keycloak.authenticated ?? false

    setIsAuthenticated(auth)

    if (auth) {
      setUsername(keycloak.tokenParsed?.preferred_username ?? null)
      setFirstname(keycloak.tokenParsed?.given_name ?? null)
      setLastname(keycloak.tokenParsed?.family_name ?? null)
      setEmail(keycloak.tokenParsed?.email ?? null)
      setToken(keycloak.token ?? null)
    } else {
      setUsername(null)
      setFirstname(null)
      setLastname(null)
      setEmail(null)
      setToken(null)
      setFcmToken(null)
    }
  }, [])

  useEffect(() => {
    syncAuth()

    const interval = setInterval(() => {
      syncAuth()
    }, 1000)

    return () => clearInterval(interval)
  }, [syncAuth])

  const login = React.useCallback(() => {
    keycloak.login()
  }, [])

  const logout = React.useCallback(() => {
    keycloak.logout()
  }, [])

  useEffect(() => {
    if (token && username) {
        registerDeviceWithBackend(token, username).then((fcm) => {
            if (fcm) setFcmToken(fcm);
        });

        // Ascolta le notifiche push in primo piano
        const unsubscribe = onMessage(messaging, (payload) => {
            console.log("Notifica push ricevuta:", payload);
            
            if (payload.notification) {
                const { title, body, icon } = payload.notification;

                // Controlla se il browser supporta le notifiche e se il permesso è stato accordato
                if ("Notification" in window && Notification.permission === "granted") {
                    
                    // Mostra la notifica nativa nella barra delle notifiche del dispositivo
                    new Notification(title || "Nuova Notifica", {
                        body: body,
                        icon: icon || "/firebase-logo.png", // Opzionale: aggiunge un'icona alla notifica
                    });
                }
            }
        });
        
        return () => unsubscribe();
    }
}, [token, username]);

  return (
    <AuthContext.Provider
      value={{
        username,
        firstname,
        lastname,
        email,
        token,
        isAuthenticated,
        fcmToken,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
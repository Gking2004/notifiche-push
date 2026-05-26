import * as React from "react"

interface AuthContextType {
  username: string | null
  token: string | null
  login: (username: string, token: string) => void
  logout: () => void
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = React.useState<string | null>(() => {
    return localStorage.getItem("auth_username")
  })
  const [token, setToken] = React.useState<string | null>(() => {
    return localStorage.getItem("auth_token")
  })

  const login = React.useCallback((newUsername: string, newToken: string) => {
    setUsername(newUsername)
    setToken(newToken)
    localStorage.setItem("auth_username", newUsername)
    localStorage.setItem("auth_token", newToken)
  }, [])

  const logout = React.useCallback(() => {
    setUsername(null)
    setToken(null)
    localStorage.removeItem("auth_username")
    localStorage.removeItem("auth_token")
  }, [])

  const value = React.useMemo(() => ({
    username,
    token,
    login,
    logout
  }), [username, token, login, logout])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

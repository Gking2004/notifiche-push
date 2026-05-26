import { Navbar } from "@/components/navbar"
import { useAuth } from "@/components/context/auth"

export function App() {
  const { username, isAuthenticated, login, logout } = useAuth()

  return (
    <div className="flex flex-col min-h-svh">
      <Navbar />
      <div className="flex-1 flex justify-center items-center mt-16">
        {isAuthenticated ? (
          <div>
            <p>Benvenuto, {username} </p>
            <button onClick={logout}>Logout</button>
          </div>
        ) : (
          <button onClick={login}>Login</button>
        )}
      </div>
    </div>
  )
}

export default App

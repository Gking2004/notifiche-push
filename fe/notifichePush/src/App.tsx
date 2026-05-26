import { Login } from "@/components/pages/login"
import { Navbar } from "@/components/navbar"
import { Routes, Route } from "react-router-dom"
import { Signup } from "./components/pages/signup"

export function App() {
  return (
    <div className="flex flex-col min-h-svh">
      <Navbar />
      <div className="flex-1 flex justify-center items-center mt-16">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Signup />} />
        </Routes>
      </div>
    </div>
  )
}

export default App

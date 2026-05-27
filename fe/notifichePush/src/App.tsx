import { Navbar } from "@/components/navbar"
import { Home } from "./components/pages/home"

export function App() {

  return (
    <div className="flex flex-col min-h-svh">
      <Navbar />
      <Home />
    </div>
  )
}

export default App

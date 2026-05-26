import { Sun, Moon } from "lucide-react";
import { useTheme } from "./context/theme";

export function Navbar() {
    const { theme, setTheme } = useTheme();

    return (
        <nav className="p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold">Notifiche</h1>
                </div>
                <div>
                    {theme === "light" ? (
                        <Sun className="cursor-pointer" onClick={() => {
                            setTheme("dark");
                        }} />
                    ) : (
                        <Moon className="cursor-pointer" onClick={() => {
                            setTheme("light");
                        }} />
                    )}
                </div>
            </div>
        </nav>
    )
}
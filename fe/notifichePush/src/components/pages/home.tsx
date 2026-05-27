import { useAuth } from "../context/auth"
import { FormNotifiche } from "../formNotifiche"
import { Button } from "../ui/button"

export function Home() {
    const { username, isAuthenticated,token, login, logout } = useAuth()

    return (
        <div className="flex-1 flex flex-col">
            {isAuthenticated ? (
                <>
                    <div className="flex items-center justify-between px-6 py-3 border-b">
                        <p className="text-sm text-muted-foreground">
                            Benvenuto, <span className="font-medium text-foreground">{username}</span>
                        </p>
                        <Button onClick={logout} variant="outline" className="hover:text-white hover:bg-red-600 transition" size="sm">Logout</Button>
                    </div>
                    <div className="flex-1 flex justify-center items-center mt-16">
                        <FormNotifiche />
                    </div>
                </>
            ) : (
                <div className="flex-1 flex justify-center items-center">
                    <Button onClick={login}>Login</Button>
                </div>
            )}
        </div>
    )
}
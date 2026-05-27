import { useState } from "react";
import { Button } from "./ui/button";
import type { NotificationType } from "@/types/notification";
import { useAuth } from "./context/auth";


const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function FormNotifiche() {
    const [type, setType] = useState<NotificationType>("VACATION_REQUEST");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [error, setError] = useState("");

    const { username,firstname,lastname,email,token } = useAuth()

    const handleSubmit = async () => {
        setError("");
        if (!startDate || !endDate) {
            setError("Compila entrambe le date.");
            return;
        }
        if (endDate <= startDate) {
            setError("La data fine deve essere successiva alla data inizio.");
            return;
        }

        try {
            const resp = await fetch(`${BASE_URL}/api/notification/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({
                    type,
                    title: "Richiesta ferie",
                    body: `${firstname} ${lastname} ha richiesto le ferie dal ${startDate} al ${endDate}`,
                    payload: { startDate, endDate, username, firstname, lastname, email }
                })
            });
            const data = await resp.json();
            if(resp.ok){
                console.log("data: ", data);
            }else {
                setError(data.error || "Errore generico");
            }
        } catch (error) {
            setError("Errore nell'invio della notifica");
        }
    };

    return (
        <div className="flex flex-col gap-4 p-4 border rounded-lg w-96">
            <p className="text-sm text-muted-foreground">Tipo di notifica</p>
            <div className="grid grid-cols-3 gap-2">
                {(["VACATION_REQUEST"] as NotificationType[]).map(t => (
                    <button
                        key={t}
                        onClick={() => setType(t)}
                        className={`p-2 text-sm rounded border ${type === t ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200"}`}
                    >
                        {t === "VACATION_REQUEST" ? "Ferie":t}
                    </button>
                ))}
            </div>

            {type === "VACATION_REQUEST" && (
                <div className="flex flex-col gap-3">
                    <div>
                        <label className="text-sm text-muted-foreground">Data inizio</label>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full border rounded p-2 mt-1" />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground">Data fine</label>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full border rounded p-2 mt-1" />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <Button onClick={handleSubmit}>Invia notifica</Button>
                </div>
            )}
        </div>
    );
}
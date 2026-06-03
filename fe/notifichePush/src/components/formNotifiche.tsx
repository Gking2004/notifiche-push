import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import type { NotificationType } from "@/types/notification";
import { useAuth } from "./context/auth";
import { DatePickerWithRange } from "./DatePickerWhitRamge";
import { type DateRange } from "react-day-picker";
import { format } from "date-fns";


const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function FormNotifiche() {
    const [type, setType] = useState<NotificationType>("VACATION_REQUEST");
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [error, setError] = useState("");
    const [message, setMessage] = useState<"success" | "error" | null>(null);
    const [visible, setVisible] = useState(false);


    const { username,firstname,lastname,email,token } = useAuth()


    useEffect(() => {
        if (message) {
            setTimeout(() => setVisible(true), 10);
        }
    }, [message]);

    const handleClose = () => {
        setVisible(false);
        setTimeout(() => setMessage(null), 300);
    };


    const handleSubmit = async () => {
    setError("");
    const startDate = dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : null;
    const endDate   = dateRange?.to   ? format(dateRange.to,   "yyyy-MM-dd") : null;

    if (!startDate || !endDate) {
        setError("Seleziona un intervallo di date.");
        return;
    }

    try {
        // 1. Chiamata al backend per creare la notifica base (la richiesta ferie)
        const resp = await fetch(`${BASE_URL}/api/notification/create`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify({
                type,
                title: "Richiesta ferie",
                body: `${firstname} ${lastname} ha richiesto le ferie dal ${startDate} al ${endDate}`,
                payload: { startDate, endDate, username, firstname, lastname, email }
            })
        });
        
        const notificationData = await resp.json();
        
        if (!resp.ok) {
            setError(notificationData.error || "Errore durante la creazione della notifica");
            setMessage("error");
            return;
        }

        // 2. Recupero il token FCM di questo dispositivo salvato nel localStorage
        const clientDeviceToken = localStorage.getItem("fcm_device_token");
        if (!clientDeviceToken) {
            setError("Dispositivo non registrato per le notifiche push.");
            setMessage("error");
            return;
        }

        // 3. Chiamata alla rotta di invio del tuo microservizio (createDeviceNotification)
        const sendResp = await fetch(`${BASE_URL}/device-notifications/send`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify({
                notificationId: notificationData.id, // ID generato dallo step 1
                deviceToken: clientDeviceToken       // Il token FCM del destinatario
            })
        });

        if (sendResp.ok) {
            setMessage("success");
        } else {
            const sendError = await sendResp.json();
            setError(sendError.error || "Errore nell'invio della push tramite Firebase");
            setMessage("error");
        }

    } catch (error) {
        console.error("Errore nel flusso di invio:", error);
        setError("Errore nell'invio della notifica");
        setMessage("error");
    }
};
    return (
        <>
        <div
            className={`fixed left-1/2 z-50 w-full max-w-md flex items-center justify-between px-4 py-3 rounded-lg border
                transition-all duration-300 ease-out -translate-x-1/2
                ${visible ? "top-4 opacity-100" : "-top-16 opacity-0"}
                ${message === "success"
                    ? "bg-green-50 border-green-400 text-green-700"
                    : "bg-red-50 border-red-400 text-red-700"
                }`}
        >
        <div className="flex items-center gap-2">
          {message === "success" ? (
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          )}
          <p className="text-sm font-medium">
            {message === "success"
              ? "Notifica inviata con successo!"
              : "Errore nell'invio della notifica"}
          </p>
        </div>

        <button
          onClick={handleClose}
          className={`p-1 rounded hover:opacity-70 transition-opacity ${
            message === "success" ? "text-green-600" : "text-red-600"
          }`}
          aria-label="Chiudi"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    
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
                    <DatePickerWithRange
                        label="Periodo di ferie"
                        value={dateRange}
                        onChange={setDateRange}
                    />
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <Button onClick={handleSubmit}>Invia notifica</Button>
                </div>
            )}
        </div>
        </>
    );
}
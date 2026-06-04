import { messaging } from "@/config/firebase";
import { getToken } from "firebase/messaging";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const registerDeviceWithBackend = async (tokenKeycloak: string, userId: string): Promise<string | undefined> => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Permesso notifiche negato.");
      return;
    }

    const currentToken = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
    });

    if (currentToken) {
      await fetch(`${BASE_URL}/devices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tokenKeycloak}`
        },
        body: JSON.stringify({
          userId: userId,
          token: currentToken,
          platform: "WEB"
        })
      });
      
      return currentToken;
    }
  } catch (error) {
    console.error("Errore durante la registrazione del device:", error);
  }
};
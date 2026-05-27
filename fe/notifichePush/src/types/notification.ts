export type NotificationType = "VACATION_REQUEST"; 

export interface Notification {
    id: string;
    title: string;
    body: string;
    type: NotificationType;
    payload: Record<string, unknown>;
}


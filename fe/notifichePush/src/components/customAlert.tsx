import { X } from "lucide-react"

const alertTypes = {
    error: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50 text-red-500 dark:text-red-400",
    success: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/50 text-green-500 dark:text-green-400",
    warning: "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900/50 text-yellow-500 dark:text-yellow-400",
}

interface CustomAlertProps {
    message: string;
    type: keyof typeof alertTypes;
    onClose?: () => void;
    className?: string;
}

export function CustomAlert({ message, type, onClose, className }: CustomAlertProps) {
    const alertType = alertTypes[type]

    return (
        <div
            className={`
                flex items-center justify-between gap-1
                px-4 py-3 text-sm font-medium rounded-lg border shadow-lg
                animate-in slide-in-from-bottom-4 fade-in duration-300
                ${alertType} ${className ?? ""}
            `}
        >
            <span>{message}</span>
            {onClose && (
                <button
                    onClick={onClose}
                    aria-label="Chiudi"
                    className="ml-2 shrink-0 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    )
}

export default CustomAlert
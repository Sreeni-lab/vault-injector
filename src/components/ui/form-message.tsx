import { ReactNode } from "react";
import { AlertCircle } from "lucide-react";

export function FormError({ children }: { children: ReactNode }) {
    return (
        <div className="flex items-start gap-2 mt-2 p-3 rounded-lg border-l-4 border-destructive bg-destructive/10 shadow-sm">
            <AlertCircle className="w-5 h-5 mt-0.5 text-destructive" />
            <span className="text-sm text-destructive">{children}</span>
        </div>
    );
}

export function FormWarning({ children }: { children: ReactNode }) {
    return (
        <div className="flex items-start gap-2 mt-2 p-3 rounded-lg border-l-4 border-yellow-500 bg-yellow-500/10 shadow-sm">
            <AlertCircle className="w-5 h-5 mt-0.5 text-yellow-600" />
            <span className="text-sm text-yellow-700 dark:text-yellow-200">{children}</span>
        </div>
    );
} 
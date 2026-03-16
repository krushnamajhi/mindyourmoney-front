import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useMemo } from 'react';

interface ErrorDisplayProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    fullScreen?: boolean;
    icon?: React.ReactNode;
}

export function ErrorDisplay({ 
    title = "Oops! Error Occurred", 
    message = "Something went wrong", 
    onRetry, 
    fullScreen = false,
    icon = <AlertTriangle size={32} />
}: ErrorDisplayProps) {
    const content = useMemo(() => (
        <div className="flex flex-col items-center justify-center text-center p-6 max-w-sm mx-auto">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-500 shadow-sm">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-500 mb-6">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all hover:shadow-md"
                >
                    <RefreshCw size={16} />
                    <span>Try Again</span>
                </button>
            )}
        </div>
    ), [message, onRetry, title, icon]);

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
                {content}
            </div>
        );
    }

    return content;
}

import { useMemo } from 'react';

interface MessageProps {
    message: string;
    fullScreen?: boolean;
    icon?: React.ReactNode;
}

export function Message({
    message,
    fullScreen = false,
    icon
}: MessageProps) {
    const content = useMemo(() => (
        <div className="flex flex-col items-center justify-center text-center p-6 max-w-sm mx-auto">
            {icon && (<div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-500 shadow-sm">
                {icon}
            </div>)}
            <div className="px-6 py-12 text-center text-slate-500">
                {message}
            </div>
        </div>
    ), [message, icon]);

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
                {content}
            </div>
        );
    }

    return content;
}

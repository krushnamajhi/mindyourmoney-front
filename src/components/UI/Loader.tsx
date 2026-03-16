import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { useMemo } from 'react';

interface LoaderProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    text?: string;
    fullScreen?: boolean;
}

const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
};

export function Loader({ size = 'md', className, text, fullScreen = false }: LoaderProps) {
    const content = useMemo(() => (
        <div className={clsx("flex flex-col items-center justify-center text-primary-600", className)}>
            <Loader2 className={clsx("animate-spin", sizeClasses[size])} />
            {text && <p className="mt-3 text-sm font-medium text-slate-500 animate-pulse">{text}</p>}
        </div>
    ), [className, size, text]);

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
                {content}
            </div>
        );
    }

    return content;
}

import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: React.ReactNode;
    children: React.ReactNode;
    size?: 'lg' | 'md' | 'sm';
    className?: string;
    color?: 'primary' | 'primaryNoBackground' | 'disabledprimaryNoBackground';
}
export function Button({ children, icon, className, size = 'md', color = 'primary', ...props }: ButtonProps) {
    const sizeClass = {
        lg: 'px-6 py-3 font-medium text-lg',
        md: 'px-5 py-2.5 font-medium text-md',
        sm: 'px-4 py-2 font-medium text-sm',
    };
    const colorClass = {
        primary: 'bg-primary-900 hover:bg-primary-800 text-white',
        primaryNoBackground: 'text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100',
        disabledprimaryNoBackground: 'text-slate-600 bg-slate-100 hover:bg-slate-0',
    };
    return (
        <button
            {...props}
            className={cn("flex items-center space-x-2 bg-primary-900 hover:bg-primary-800 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-primary-900/20", className, sizeClass[size], colorClass[color])}
        >
            {icon}
            <span>{children}</span>
        </button>
    );
}
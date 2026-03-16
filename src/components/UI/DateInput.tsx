import { clsx } from "clsx";
import { } from "lucide-react";

interface DateProps extends React.InputHTMLAttributes<HTMLInputElement> {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    max?: string;
    min?: string;
    title?: string;
    label?: string;
}

export function DateInput({ value, onChange, max, min, title, label, className, ...props }: DateProps) {
    return (
        <div className={clsx("relative group/date", className)}>
            <div className={clsx(
                "flex items-center space-x-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 transition-all duration-300 shadow-sm relative overflow-hidden",
                "hover:bg-slate-50 hover:shadow-md focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500/30"
            )}>
                {/* Liquid Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 -translate-x-full group-hover/date:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                <div className="flex flex-col relative z-10 flex-1 min-w-[100px]">
                    {label && (
                        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter leading-none mb-0.5">
                            {label}
                        </span>
                    )}
                    <input
                        type="date"
                        value={value}
                        max={max}
                        min={min}
                        onChange={onChange}
                        className={clsx(
                            "bg-transparent focus:outline-none cursor-pointer text-xs font-bold w-full transition-colors",
                            "appearance-none [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100",
                            !value ? "text-slate-400" : "text-slate-700"
                        )}
                        title={title}
                        {...props}
                    />
                </div>
            </div>
        </div>
    );
}

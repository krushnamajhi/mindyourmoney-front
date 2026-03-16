import { useState, useRef, useEffect } from "react";
import { clsx } from "clsx";
import { ChevronDown, Check } from "lucide-react";

export interface BaseSelectOption {
    label: string;
    value: string | number;
}

export interface BaseSelectProps {
    icon?: React.ReactNode;
    options: (string | BaseSelectOption)[];
    value: string | number;
    onChange: (val: string) => void;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
}

export function BaseSelect({
    icon,
    options,
    value,
    onChange,
    disabled,
    className,
    placeholder = 'Select...'
}: BaseSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const normalizedOptions = options.map(opt =>
        typeof opt === 'string' 
            ? { label: opt, value: opt } 
            : { label: opt.label, value: String(opt.value) }
    );

    const selectedOption = normalizedOptions.find(opt => opt.value === value);
    const displayLabel = selectedOption?.label || placeholder;

    const handleSelect = (val: string) => {
        onChange(val);
        setIsOpen(false);
    };

    return (
        <div className={clsx("relative", disabled && "opacity-50 cursor-not-allowed", className)} ref={dropdownRef}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 transition-all duration-300 shadow-sm relative overflow-hidden group/trigger w-full h-[42px]",
                    !disabled && "hover:bg-slate-50 hover:shadow-md cursor-pointer",
                    isOpen && "ring-2 ring-primary-500/20 border-primary-500/30"
                )}
            >
                {/* Liquid Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 -translate-x-full group-hover/trigger:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                <div className="flex items-center space-x-2 relative z-10 w-full">
                    {icon && (
                        <span className="text-slate-500 group-hover/trigger:text-primary-500 transition-colors">
                            {icon}
                        </span>
                    )}
                    <span className="font-semibold truncate flex-1 text-left">
                        {displayLabel}
                    </span>
                    <ChevronDown size={14} className={clsx("text-slate-400 transition-transform duration-300", isOpen && "rotate-180")} />
                </div>
            </button>

            {/* Dropdown Menu */}
            <div
                className={clsx(
                    "absolute top-full mt-2 left-0 min-w-[200px] bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden py-2 transition-all duration-300 origin-top transform",
                    isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                )}
            >
                {/* Background Decor */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-h-[280px] overflow-y-auto custom-scrollbar">
                    {normalizedOptions.map((opt) => {
                        const isSelected = opt.value === value;

                        return (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => handleSelect(opt.value)}
                                className={clsx(
                                    "w-full flex items-center justify-between px-4 py-2.5 text-sm transition-all duration-200 group/item relative",
                                    isSelected
                                        ? "bg-primary-50 text-primary-700 font-bold"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <span className="flex-1 text-left relative z-10">{opt.label}</span>
                                {isSelected && (
                                    <Check size={14} className="text-primary-500 ml-2 relative z-10" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

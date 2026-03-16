import { useState, useRef, useEffect } from "react";
import { clsx } from "clsx";
import { ChevronDown, Check, X } from "lucide-react";

export interface MultiselectOption {
    label: string;
    value: string | number;
}

export interface MultiselectFilterProps {
    icon?: React.ReactNode;
    options: (string | MultiselectOption)[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
}

export function MultiselectFilter({
    icon,
    options,
    selectedValues,
    onChange,
    disabled,
    className,
    placeholder = 'Select multiple...'
}: MultiselectFilterProps) {
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

    const handleToggle = (val: string) => {
        if (selectedValues.includes(val)) {
            onChange(selectedValues.filter(v => v !== val));
        } else {
            onChange([...selectedValues, val]);
        }
    };

    const handleRemove = (e: React.MouseEvent, val: string) => {
        e.stopPropagation();
        onChange(selectedValues.filter(v => v !== val));
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange([]);
    };

    return (
        <div className={clsx("relative", disabled && "opacity-50 cursor-not-allowed", className)} ref={dropdownRef}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 transition-all duration-300 shadow-sm relative group/trigger min-h-[42px] w-full",
                    !disabled && "hover:bg-slate-50 hover:shadow-md cursor-pointer",
                    isOpen && "ring-2 ring-primary-500/20 border-primary-500/30"
                )}
            >
                {/* Liquid Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 -translate-x-full group-hover/trigger:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                <div className="flex items-center space-x-2 relative z-10 w-full overflow-hidden">
                    {icon && (
                        <span className="text-slate-500 group-hover/trigger:text-primary-500 transition-colors flex-shrink-0">
                            {icon}
                        </span>
                    )}

                    <div className="flex-1 flex flex-wrap gap-1 items-center overflow-hidden">
                        {selectedValues.length === 0 ? (
                            <span className="text-slate-400 font-medium truncate">{placeholder}</span>
                        ) : (
                            selectedValues.map(val => {
                                const option = normalizedOptions.find(o => o.value === val);
                                return (
                                    <span
                                        key={val}
                                        className="inline-flex items-center bg-primary-50 text-primary-700 px-2 py-0.5 rounded-lg text-xs font-bold border border-primary-100 animate-in zoom-in-95 duration-200"
                                    >
                                        {option?.label || val}
                                        <X
                                            size={10}
                                            className="ml-1 hover:text-primary-900 cursor-pointer"
                                            onClick={(e) => handleRemove(e, val)}
                                        />
                                    </span>
                                )
                            })
                        )}
                    </div>

                    <div className="flex items-center space-x-1 ml-auto flex-shrink-0">
                        {selectedValues.length > 0 && (
                            <X
                                size={14}
                                className="text-slate-300 hover:text-slate-500 transition-colors"
                                onClick={handleClear}
                            />
                        )}
                        <ChevronDown size={14} className={clsx("text-slate-400 transition-transform duration-300", isOpen && "rotate-180")} />
                    </div>
                </div>
            </button>

            {/* Dropdown Menu */}
            <div
                className={clsx(
                    "absolute top-full mt-2 left-0 min-w-[200px] w-full bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden py-2 transition-all duration-300 origin-top transform",
                    isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                )}
            >
                {/* Background Decor */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-h-[280px] overflow-y-auto custom-scrollbar">
                    {normalizedOptions.map((opt) => {
                        const isSelected = selectedValues.includes(opt.value);

                        return (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => handleToggle(opt.value)}
                                className={clsx(
                                    "w-full flex items-center justify-between px-4 py-2.5 text-sm transition-all duration-200 group/item relative",
                                    isSelected
                                        ? "bg-primary-50/50 text-primary-700 font-bold"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <div className="flex items-center space-x-3 flex-1">
                                    <div className={clsx(
                                        "w-4 h-4 rounded border transition-all flex items-center justify-center",
                                        isSelected
                                            ? "bg-primary-500 border-primary-500 shadow-sm"
                                            : "border-slate-300 bg-white"
                                    )}>
                                        {isSelected && <Check size={10} className="text-white" strokeWidth={4} />}
                                    </div>
                                    <span className="text-left relative z-10">{opt.label}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

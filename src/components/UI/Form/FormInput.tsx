import { cn } from "../../../utils/cn";

export default function FormInput({ data }: { data: any }) {
    const { label, viewMode, icon, value: manualValue, viewModeValue, type, ...props } = data;
    const isViewMode = viewMode === true;

    return (
        <div className="space-y-2">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest px-1">{label}</label>
            <div className="relative group">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                        {icon}
                    </div>
                )}
                {isViewMode ? (
                    <div className={cn(
                        "w-full text-slate-800 font-bold min-h-[50px] flex items-center",
                        icon ? "pl-11 pr-5" : "px-5"
                    )}>
                        {viewModeValue || props.value || <span className="text-slate-400 italic">No data</span>}
                    </div>
                ) : (
                    <input
                        {...props}
                        value={manualValue ?? props.value}
                        type={type === "amount" ? "number" : (type || "text")}
                        step={type === "amount" ? "0.01" : undefined}
                        min={type === "amount" ? "0" : undefined}
                        className={cn(
                            "w-full py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500/30 transition-all shadow-inner",
                            icon ? "pl-11 pr-4" : "px-5"
                        )}
                        placeholder={props.placeholder || (type === "amount" ? "0.00" : "e.g., Summer Trip, Apartment 302")}
                    />
                )}
            </div>
        </div>
    );
}
import { useSettings } from "../../context/SettingsContext";
import { cn } from "../../utils/cn";

export function FinancialCard({ title, amount, description, percentage, icon }: { title: string; amount: number; description: string; percentage: number; icon: React.ReactNode }) {
    const { formatCurrency } = useSettings();
    const percentageColor = percentage > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
    const percentageText = (percentage > 0 ? '+' : '') + percentage + "%";
    return (
        <div className="glass-morphism p-4 rounded-2xl relative overflow-hidden transition-all hover:scale-[1.01] hover:shadow-xl">
            <div className="absolute top-0 right-0 p-3">
                {/* <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", percentageColor)}>{percentageText}</span> */}
            </div>
            <div className="absolute top-0 right-0 p-3">
            {icon}
            </div>
            <p className="text-slate-500 text-xs font-medium mb-1">{title} </p>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">{formatCurrency(amount)}
            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", percentageColor)}>{percentageText}</span>
            </h3>
            <p className="text-[11px] text-slate-400">{description}</p>
        </div>
    )
}

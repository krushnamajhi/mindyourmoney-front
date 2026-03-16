import { useSettings } from "../../context/SettingsContext";
import { cn } from "../../utils/cn";

export function FinancialCard({ title, amount, description, percentage, icon }: { title: string; amount: number; description: string; percentage: number; icon: React.ReactNode }) {
    const { formatCurrency } = useSettings();
    const percentageColor = percentage > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
    const percentageText = (percentage > 0 ? '+' : '') + percentage + "%";
    return (
        <div className="glass-morphism p-6 rounded-2xl relative overflow-hidden transition-all hover:scale-[1.02] hover:shadow-2xl">
            <div className="absolute top-0 right-0 p-4">
                <span className={cn("text-xs font-bold px-2 py-1 rounded-full", percentageColor)}>{percentageText}</span>
            </div>
            {icon}
            <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-slate-900 mb-2">{formatCurrency(amount)}</h3>
            <p className="text-xs text-slate-400">{description}</p>
        </div>
    )
}
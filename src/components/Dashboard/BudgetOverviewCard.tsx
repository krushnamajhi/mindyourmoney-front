import { MoreVertical } from "lucide-react";
import DynamicStatusCircle from "./DynamicStatusCircle";
import { useSettings } from "../../context/SettingsContext";

export function BudgetOverviewCard({ totalSpent, remainingAmount }: { totalSpent: number, remainingAmount: number }) {
    const { formatCurrency } = useSettings();
    const percentage = (totalSpent / (totalSpent + remainingAmount)) * 100;

    return (
        <div className="glass-morphism rounded-2xl p-6 transition-all hover:shadow-2xl">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900">Budget Overview</h3>
                <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={20} /></button>
            </div>

            {/* Circular Chart Placeholder */}
            <div className="flex flex-col items-center justify-center py-8 relative">
                <DynamicStatusCircle percentage={percentage} />
            </div>
            <div className="space-y-4 mt-4">
                <div className="flex justify-between items-center bg-white/30 p-3 rounded-lg backdrop-blur-sm border border-white/20">
                    <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getColorClass(totalSpent, remainingAmount)}`}></div>
                        <span className="text-sm font-medium text-slate-600">Total Spent</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{formatCurrency(totalSpent)}</span>
                </div>
                <div className="flex justify-between items-center bg-white/30 p-3 rounded-lg backdrop-blur-sm border border-white/20">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                        <span className="text-sm font-medium text-slate-600">Remaining</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{formatCurrency(remainingAmount)}</span>
                </div>
            </div>

            {/* <div className="mt-8 bg-orange-50 rounded-xl p-4 flex items-start space-x-3">
                            <div className="text-orange-500 mt-0.5">
                                <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center text-white text-[10px] font-bold">!</div>
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 leading-snug">You have reached <span className="font-bold text-slate-800">65%</span> of your monthly goal.</p>
                                <div className="w-full bg-orange-200 h-1.5 rounded-full mt-3 overflow-hidden">
                                    <div className="bg-orange-500 h-full w-2/3 rounded-full"></div>
                                </div>
                            </div>
                        </div> */}
        </div>
    );
}

const getColorClass = (totalSpent: number, remainingAmount: number) => {
    const percentage = (totalSpent / (totalSpent + remainingAmount)) * 100;
    if (percentage > 80) return 'bg-red-500';      // CRITICAL: Red
    if (percentage < 50) return 'bg-green-500';    // SAFE: Cyber Green
    return 'bg-amber-500';                  // WARNING: Amber (50% - 80%)
};
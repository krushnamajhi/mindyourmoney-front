import type { SplitType } from '../../../domain/models';
import { cn } from '../../../utils/cn';
import { Divide, Percent, PieChart, Scale, Receipt } from 'lucide-react';

interface SplitStrategySelectorProps {
    value: SplitType;
    onChange: (value: SplitType) => void;
}

export function SplitStrategySelector({ value, onChange }: SplitStrategySelectorProps) {
    const strategies: { type: SplitType; label: string; icon: React.ReactNode }[] = [
        { type: 'EQUAL', label: 'Equally', icon: <Divide size={16} /> },
        { type: 'PERCENT', label: 'In %', icon: <Percent size={16} /> },
        { type: 'SHARES', label: 'By Shares', icon: <PieChart size={16} /> },
        { type: 'EXACT', label: 'Unequally', icon: <Scale size={16} /> },
        { type: 'ITEMS', label: 'By Items', icon: <Receipt size={16} /> },
    ];

    return (
        <div className="flex p-1 bg-slate-100 rounded-xl overflow-x-auto no-scrollbar">
            {strategies.map((strategy) => (
                <button
                    key={strategy.type}
                    type="button"
                    onClick={() => onChange(strategy.type)}
                    className={cn(
                        "flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap",
                        value === strategy.type
                            ? "bg-white text-primary-700 shadow-sm ring-1 ring-black/5"
                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                    )}
                >
                    {strategy.icon}
                    <span>{strategy.label}</span>
                </button>
            ))}
        </div>
    );
}

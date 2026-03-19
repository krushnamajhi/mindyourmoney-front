// import { useState } from 'react';
import type { User, DebtMemberSplits } from '../../../domain/models';
import { cn } from '../../../utils/cn';

type UserWithActive = User & { isActive?: boolean };

interface PercentageSplitProps {
    amount: number;
    members: UserWithActive[];
    definitions: DebtMemberSplits[];
    onChange: (definitions: DebtMemberSplits[]) => void;
    isReadOnly?: boolean;
}

export function PercentageSplit({ amount, members, definitions, onChange, isReadOnly = false }: PercentageSplitProps) {
    const handlePercentageChange = (userId: string, percentage: number) => {
        if (isReadOnly) return;
        const otherDefs = definitions.filter(d => d.userId !== userId);
        onChange([...otherDefs, { userId, percent: percentage, amount: (amount * percentage) / 100 }]);
    };

    const totalPercentage = definitions.reduce((sum, def) => sum + (def.percent || 0), 0);
    const isValid = Math.abs(totalPercentage - 100) < 0.01;

    const getPercentage = (userId: string) => {
        return definitions.find(d => d.userId === userId)?.percent || 0;
    };

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex justify-between items-center px-1">
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                    Enter Percentages
                </span>
                <span className={cn(
                    "text-xs font-medium px-2 py-1 rounded-full",
                    isValid
                        ? "text-emerald-600 bg-emerald-50"
                        : "text-red-600 bg-red-50"
                )}>
                    Total: {totalPercentage.toFixed(1)}% / 100%
                </span>
            </div>

            <div className="space-y-2">
                {members.map(member => {
                    const percentage = getPercentage(member.id);
                    const shareAmount = (amount * percentage) / 100;

                    return (
                        <div key={member.id} className="flex items-center space-x-3 p-2 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-bold text-slate-500 shadow-sm">
                                {member.firstName?.charAt(0).toUpperCase() || member.email.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-700 truncate">
                                    {member.fullName || member.email} {isReadOnly && member.isActive === false && "(Inactive)"}
                                </p>
                                <div className="w-20 text-left text-xs text-slate-500">
                                    ${shareAmount.toFixed(2)}
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="relative w-24">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        readOnly={isReadOnly}
                                        value={percentage || 0}
                                        onChange={(e) => handlePercentageChange(member.id, parseFloat(e.target.value) || 0)}
                                        className={cn(
                                            "w-full pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-right focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all",
                                            isReadOnly && "bg-transparent border-none p-0 cursor-default shadow-none focus:ring-0"
                                        )}
                                        placeholder="0"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">%</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {!isValid && (
                <p className="text-center text-xs text-red-500 font-medium">
                    Percentages must add up to exactly 100% ({100 - totalPercentage}% remaining)
                </p>
            )}
        </div>
    );
}

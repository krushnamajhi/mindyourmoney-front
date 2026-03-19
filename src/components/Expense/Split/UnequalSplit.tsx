import type { User, DebtMemberSplits } from '../../../domain/models';
import { cn } from '../../../utils/cn';

type UserWithActive = User & { isActive?: boolean };

interface UnequalSplitProps {
    amount: number;
    members: UserWithActive[];
    definitions: DebtMemberSplits[];
    onChange: (definitions: DebtMemberSplits[]) => void;
    isReadOnly?: boolean;
}

export function UnequalSplit({ amount, members, definitions, onChange, isReadOnly = false }: UnequalSplitProps) {
    const handleAmountChange = (userId: string, value: number) => {
        if (isReadOnly) return;
        let _value = 0
        if (value != null) {
            _value = value;
        }
        const otherDefs = definitions.filter(d => Number(d.userId) !== Number(userId));
        onChange([...otherDefs, { userId, amount: _value }]);
    };

    const totalAllocated = definitions.reduce((sum, def) => sum + (def.amount || 0), 0);
    const remaining = amount - totalAllocated;
    const isValid = Math.abs(remaining) < 0.01;

    const getAmount = (userId: string) => {
        return definitions.find(d => Number(d.userId) === Number(userId))?.amount || 0;
    };

    console.log(amount, members, definitions, "exact")

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex justify-between items-center px-1">
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                    Enter Amounts
                </span>
                <span className={cn(
                    "text-xs font-bold px-2 py-1 rounded-full",
                    isValid
                        ? "text-emerald-600 bg-emerald-50"
                        : "text-red-600 bg-red-50"
                )}>
                    Remaining: ${remaining.toFixed(2)}
                </span>
            </div>

            <div className="space-y-2">
                {members.map(member => {
                    const value = getAmount(member.id);

                    return (
                        <div key={member.id} className="flex items-center space-x-3 p-2 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-bold text-slate-500 shadow-sm">
                                {member.firstName?.charAt(0) || member.email.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-700 truncate">
                                    {member.fullName || member.email} {isReadOnly && member.isActive === false && "(Inactive)"}
                                </p>
                            </div>
                            <div className="relative w-32">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">$</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    readOnly={isReadOnly}
                                    value={value || ''}
                                    onChange={(e) => handleAmountChange(member.id, parseFloat(e.target.value) || 0)}
                                    className={cn(
                                        "w-full pl-6 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-right focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all",
                                        isReadOnly && "bg-transparent border-none p-0 cursor-default shadow-none focus:ring-0"
                                    )}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
            {!isValid && (
                <p className="text-center text-xs text-red-500 font-medium">
                    Amounts must sum to exactly ${amount.toFixed(2)}
                </p>
            )}
        </div>
    );
}

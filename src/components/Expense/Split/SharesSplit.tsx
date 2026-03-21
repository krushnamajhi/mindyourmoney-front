import type { User, DebtMemberSplits } from '../../../domain/models';
import { cn } from '../../../utils/cn';

type UserWithActive = User & { isActive?: boolean };

interface SharesSplitProps {
    amount: number;
    members: UserWithActive[];
    definitions: DebtMemberSplits[];
    onChange: (definitions: DebtMemberSplits[]) => void;
    isReadOnly?: boolean;
}

export function SharesSplit({ amount, members, definitions, onChange, isReadOnly = false }: SharesSplitProps) {
    const handleSharesChange = (userId: number, shares: number) => {
        if (isReadOnly) return;
        const otherDefs = definitions.filter(d => d.userId !== userId);
        onChange([...otherDefs, { userId, share: shares }]);
    };

    const totalShares = definitions.reduce((sum, def) => sum + (def.share || 0), 0);
    const valuePerShare = totalShares > 0 ? amount / totalShares : 0;

    const getShares = (userId: string | number) => {
        return definitions.find(d => Number(d.userId) === Number(userId))?.share || 0;
    };

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex justify-between items-center px-1">
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                    Enter Shares
                </span>
                <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                    Total Shares: {totalShares}
                </span>
            </div>

            <div className="space-y-2">
                {members.map(member => {
                    const shares = getShares(member.id);
                    const shareAmount = shares * valuePerShare;

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
                            <div className="flex items-center space-x-2">
                                <div className="relative w-24">
                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        readOnly={isReadOnly}
                                        value={shares || ''}
                                        onChange={(e) => handleSharesChange(member.id, parseFloat(e.target.value) || 0)}
                                        className={cn(
                                            "w-full pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-right focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all",
                                            isReadOnly && "bg-transparent border-none p-0 cursor-default shadow-none focus:ring-0"
                                        )}
                                        placeholder="0"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">unit</span>
                                </div>
                                <div className="w-20 text-right text-xs font-medium text-slate-500">
                                    ${shareAmount.toFixed(2)}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <p className="text-center text-xs text-slate-400 font-medium">
                1 share = ${valuePerShare.toFixed(2)}
            </p>
        </div>
    );
}

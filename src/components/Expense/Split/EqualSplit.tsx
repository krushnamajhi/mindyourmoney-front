// useEffect removed - unused
import { Check } from 'lucide-react';
import type { DebtMemberSplits, User } from '../../../domain/models';
import { cn } from '../../../utils/cn';
import { useAuth } from '../../../context/AuthContext';

type UserWithActive = User & { isActive?: boolean };

interface EqualSplitProps {
    amount: number;
    members: UserWithActive[];
    selectedMemberIds: DebtMemberSplits[];
    onChange: (memberIds: DebtMemberSplits[]) => void;
    isReadOnly?: boolean;
}

export function EqualSplit({ amount, members, selectedMemberIds, onChange, isReadOnly = false }: EqualSplitProps) {
    const { user: currentUser } = useAuth();

    const isSelectedMember = (id: number) => {
        return selectedMemberIds.find(m => m.userId === id)
    }
    const toggleMember = (id: number) => {
        if (isReadOnly) return;
        const defs: DebtMemberSplits = { userId: id };
        if (isSelectedMember(id)) {
            onChange(selectedMemberIds.filter(m => m.userId !== id).map(m => m));
        } else {
            onChange([...selectedMemberIds, defs]);
        }
    };

    const splitAmount = selectedMemberIds.length > 0
        ? amount / selectedMemberIds.length
        : 0;

    return (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex justify-between items-center px-1">
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                    Select People ({selectedMemberIds.length})
                </span>
                <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                    ${splitAmount.toFixed(2)} / person
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {members.map(member => {
                    const isSelected = isSelectedMember(member.id);
                    return (
                        <button
                            key={member.id}
                            type="button"
                            onClick={() => toggleMember(member.id)}
                            className={cn(
                                "flex items-center justify-between p-3 rounded-xl border transition-all duration-200 text-left group",
                                isSelected
                                    ? "bg-primary-50/50 border-primary-200 shadow-sm"
                                    : "bg-white border-slate-100 hover:border-slate-300"
                            )}
                        >
                            <div className="flex items-center space-x-3">
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                                    isSelected ? "bg-primary-100 text-primary-700" : "bg-slate-100 text-slate-500"
                                )}>
                                    {member.firstName?.charAt(0) || member.email.charAt(0)}
                                </div>
                                <span className={cn(
                                    "text-sm font-medium",
                                    isSelected ? "text-primary-900" : "text-slate-600"
                                )}>
                                    {member.fullName || member.email} {currentUser?.id == member.id && "(You)"} {isReadOnly && member.isActive === false && "(Inactive)"}
                                </span>
                            </div>
                            {isSelected && (
                                <div className="text-primary-600">
                                    <Check size={16} strokeWidth={3} />
                                </div>
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    );
}

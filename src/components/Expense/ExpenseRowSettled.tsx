import { memo, useEffect, useState } from 'react';
import { Calendar, Users } from 'lucide-react';
import type { Expense, SettleExpenseDto, User } from '../../domain/models';
import { useSettings } from '../../context/SettingsContext';
import { formattedDate } from '../../utils/common';
import { useAuth } from '../../context/AuthContext';

interface ExpenseRowProps {
    settledExpense: SettleExpenseDto;
    expense: Expense;
    style?: React.CSSProperties;
    onClick: (id: string) => void
    users: User[] | undefined;
    isGroupExpenseRow?: boolean
}

export const ExpenseRowSettled = memo(function ExpenseRowSettled({ settledExpense, expense, style, onClick, users, isGroupExpenseRow = false }: ExpenseRowProps) {
    const { formatCurrency } = useSettings();
    const { user: you } = useAuth();
    const [theme, setTheme] = useState<string>('emerald');
    const [title, setTitle] = useState<string>('');
    console.log(settledExpense)
    const userWhoSettled = users?.find(u => Number(u.id) === Number(settledExpense.paidByUserId));
    const userWhoReceived = users?.find(u => Number(u.id) === Number(settledExpense.settledMemberId));
    const settledByLoggedUser = userWhoSettled?.id === you?.id;
    const receivedByLoggedUser = userWhoReceived?.id === you?.id;

    const getFullName = (user?: User) => {
        if (user?.id === you?.id) {
            return "You";
        }
        return user?.fullName;
    }


    useEffect(() => {
        if (settledByLoggedUser) {
            setTheme('red');
            setTitle(`${getFullName(userWhoSettled)} settled ${formatCurrency(settledExpense.amount)} to ${getFullName(userWhoReceived)}`)
        } else if (receivedByLoggedUser) {
            setTheme('emerald');
            setTitle(`${getFullName(userWhoSettled)} settled ${formatCurrency(settledExpense.amount)} to ${getFullName(userWhoReceived)}`)
        }
        else {
            setTheme('slate');
            setTitle(`${getFullName(userWhoSettled)} settled ${formatCurrency(settledExpense.amount)} to ${getFullName(userWhoReceived)}`)
        }
    }, [expense.id, users])


    return (
        <div
            style={style}
            className={`flex items-center justify-center px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0`}
            onClick={() => onClick(expense.id.toString())}
        >
            <div className="flex flex-col items-center text-center space-y-1 flex-1 min-w-0">
                {/* Title */}
                <h5 className={`font-bold text-${theme}-800 text-sm md:text-base`}>
                    {title}
                </h5>

                {/* Metadata Row */}
                <div className="flex items-center justify-center gap-2">
                    {/* Date */}
                    <div className={`flex items-center space-x-1 text-[11px] font-semibold text-${theme}-700 uppercase tracking-tight`}>
                        <Calendar size={10} className="flex-shrink-0" />
                        <span>{formattedDate(expense.expenseDate)}</span>
                    </div>
                    {/* Group Badge */}
                    {expense.group && !isGroupExpenseRow && (
                        <div className="flex items-center">
                            <span className={`text-${theme}-100 mr-2`}>•</span>
                            <div className={`flex items-center space-x-1 px-2 py-0.5 bg-${theme}-50 text-${theme}-700 rounded-full text-[10px] font-black uppercase tracking-wider border border-${theme}-100`}>
                                <Users size={10} />
                                <span className="truncate max-w-[100px]">{expense.group.name}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

import { memo } from 'react';
import { Calendar, Tag } from 'lucide-react';
import type { Expense } from '../../domain/models';
import { useSettings } from '../../context/SettingsContext';
import { formattedDate } from '../../utils/common';
import { getCategoryTheme } from '../../utils/categoryThemes';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';

interface ExpenseRowProps {
    expense: Expense;
    style?: React.CSSProperties;
    onClick: (id: string) => void
}

export const ExpenseRowGroup = memo(function ExpenseRow({ expense, style, onClick }: ExpenseRowProps) {
    const { formatCurrency } = useSettings();
    const { user: currentUser } = useAuth();
    console.log('expense', expense.id, expense, expense.userDebt);

    const { color, bgColor, icon } = getCategoryTheme(expense.expenseCategory?.name);

    const renderBalance = (expense: Expense) => {
        const getColor = () => {
            if (expense.userDebt < 0) {
                return 'text-red-600';
            } else if (expense.userDebt > 0) {
                return 'text-green-600';
            } else {
                return 'text-green-600';
            }
        }

        const getLabel = () => {
            if (expense.userDebt < 0) {
                return 'You borrowed';
            } else if (expense.userDebt > 0) {
                return 'You lent';
            } else {
                return 'Settled up';
            }
        }

        const getBalance = () => {
            return formatCurrency(Math.abs(expense.userDebt));
        }

        return <div>
            <div className={cn("text-xs", getColor())}>{getLabel()}</div>
            <div className={cn("text-md font-bold", getColor())}>{getBalance()}</div>
        </div>
    }

    // Format date
    return (
        <div
            style={style}
            className="flex items-center justify-between px-1 py-2 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
            onClick={() => onClick(expense.id)}
        >
            {/* Left Section: Icon + Content */}
            <div className="flex items-center space-x-3 flex-1 min-w-0">
                {/* Category Icon */}
                <div className={`w-10 h-10 rounded-full ${bgColor} ${color} flex items-center justify-center flex-shrink-0 text-sm`}>
                    <span className="font-bold">{icon}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Title */}
                    <h3 className="font-semibold text-slate-900 truncate text-sm md:text-base">
                        {expense.title}
                    </h3>

                    <p className="text-xs text-slate-500">
                        {expense.paidByUser.userInfo.id == currentUser?.id ? 'You' : expense.paidByUser.userInfo?.fullName} paid {formatCurrency(expense.amount)}
                    </p>

                    {/* Metadata Row */}
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                        {/* Date */}
                        <div className="flex items-center space-x-1 text-xs text-slate-500">
                            <Calendar size={12} className="flex-shrink-0" />
                            <span>{formattedDate(expense.expenseDate)}</span>
                        </div>

                        {/* Category Badge */}
                        {expense.expenseCategory && (
                            <div className="flex items-center space-x-1">
                                <span className="text-slate-300">•</span>
                                <div className="flex items-center space-x-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                                    <Tag size={10} />
                                    <span className="truncate max-w-[100px]">{expense.expenseCategory.name}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Section: Amount */}
            <div className="ml-4 flex-shrink-0">
                <span className="font-bold text-slate-900 text-sm md:text-base whitespace-nowrap text-right">
                    {renderBalance(expense)}
                </span>
            </div>
        </div>
    );
});

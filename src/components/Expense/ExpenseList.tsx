import { Receipt, User } from 'lucide-react';
import type { Expense } from '../../domain/models';

interface ExpenseListProps {
    expenses?: Expense[];
    isLoading: boolean;
}

export function ExpenseList({ expenses, isLoading }: ExpenseListProps) {
    if (isLoading) {
        return <div className="p-8 text-center text-slate-500">Loading expenses...</div>;
    }

    if (!expenses?.length) {
        return (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
                    <Receipt className="text-slate-400" size={24} />
                </div>
                <h3 className="text-lg font-medium text-slate-900">No expenses yet</h3>
                <p className="text-slate-500 mt-1">Create an expense to get started.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {expenses.map((expense) => (
                <div
                    key={expense.id}
                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group"
                >
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-lg">
                            {expense.title[0].toUpperCase()}
                        </div>
                        <div>
                            <h4 className="font-medium text-slate-900 group-hover:text-primary-600 transition-colors">
                                {expense.description}
                            </h4>
                            <div className="flex items-center text-sm text-slate-500 space-x-2">
                                <span className="flex items-center">
                                    <User size={14} className="mr-1" />
                                    {expense.paidByUser.userInfo.id === 'u1' ? 'You' : 'Someone'} paid
                                </span>
                                <span>•</span>
                                <span>{new Date(expense.date).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="font-bold text-slate-900">${expense.amount.toFixed(2)}</div>
                        <div className="text-xs text-slate-500">{expense.splitType.toLowerCase()} split</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

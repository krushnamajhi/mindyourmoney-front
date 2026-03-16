import { useCallback, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '../components/Layout/MainLayout';
import { useGroup } from '../hooks/useGroups';
import { useExpensesByGroupId } from '../hooks/useExpenses';
import { Plus, Settings, Receipt, Wallet, ArrowLeft } from 'lucide-react';
import { clsx } from 'clsx';
import { ExpenseForm } from '../components/Expense/ExpenseForm';
import { Loader } from '../components/UI/Loader';
import { ErrorDisplay } from '../components/UI/ErrorDisplay';
import { ExpenseRow } from '../components/Expense/ExpenseRow';
import { ExpenseRowSettled } from '../components/Expense/ExpenseRowSettled';
import type { User } from '../domain/models';
import { useSettledExpenses } from '../hooks/useSettledExpense';

type Tab = 'expenses' | 'balances';

export function GroupDetailsPage() {
    const { groupId } = useParams<{ groupId: string }>();
    const navigate = useNavigate();
    const { data: group, isLoading: isGroupLoading, error: groupError } = useGroup(groupId!);
    const { data: expenses, isLoading: isExpensesLoading, error: expensesError } = useExpensesByGroupId(groupId!);
    const { data: settledExpenses } = useSettledExpenses();
    const [activeTab, setActiveTab] = useState<Tab>('expenses');
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

    const users = useMemo(() => {
        return group?.groupMembers
            .map(gm => gm.user)
            .filter((u): u is User => !!u) || [];
    }, [group]);

    const handleRowClick = useCallback((id: string) => {
        navigate(`/expenses/view/${id}`);
    }, [navigate]);

    const handleRowClickSettled = useCallback((id: string) => {
        navigate(`/expenses/settle/view/${id}`);
    }, [navigate]);

    if (isGroupLoading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-full">
                    <Loader size="lg" text="Loading group details..." />
                </div>
            </MainLayout>
        );
    }

    if (groupError || !group) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-full">
                    <ErrorDisplay
                        message={groupError ? "Failed to load group." : "Group not found."}
                        onRetry={() => navigate('/groups')}
                    />
                </div>
            </MainLayout>
        );
    }


    return (
        <MainLayout>
            <div className="space-y-6 relative h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => navigate('/groups')} className="p-2 -ml-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 leading-none">{group.name}</h1>
                            <p className="text-sm text-slate-500 mt-1">{group.groupMembers.length} members</p>
                        </div>
                    </div>
                    <Link
                        to={`/groups/${group.id}/settings`}
                        className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <Settings size={20} />
                    </Link>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('expenses')}
                        className={clsx(
                            "flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors",
                            activeTab === 'expenses' ? "border-primary-600 text-primary-900" : "border-transparent text-slate-500 hover:text-slate-700"
                        )}
                    >
                        <Receipt size={16} />
                        <span>Expenses</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('balances')}
                        className={clsx(
                            "flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors",
                            activeTab === 'balances' ? "border-primary-600 text-primary-900" : "border-transparent text-slate-500 hover:text-slate-700"
                        )}
                    >
                        <Wallet size={16} />
                        <span>Balances</span>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto pb-20">
                    {activeTab === 'expenses' && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            {isExpensesLoading ? (
                                <div className="flex justify-center py-8">
                                    <Loader text="Loading expenses..." />
                                </div>
                            ) : expensesError ? (
                                <ErrorDisplay message="Failed to load expenses." />
                            ) : expenses?.length === 0 ? (
                                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    <p className="text-slate-500">No expenses yet.</p>
                                    <button
                                        onClick={() => setIsExpenseModalOpen(true)}
                                        className="mt-2 text-primary-600 font-medium hover:underline"
                                    >
                                        Add the first one
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3 px-3">
                                    {expenses?.map(expense => (
                                        <div key={expense.id}>
                                            {expense.isSettled ? (
                                                <ExpenseRowSettled 
                                                    onClick={handleRowClickSettled} 
                                                    expense={expense} 
                                                    settledExpense={settledExpenses?.find(se => String(se.expenseId) === String(expense.id)) as any}
                                                    users={users} 
                                                    isGroupExpenseRow={true} 
                                                />
                                            ) : (
                                                <ExpenseRow onClick={handleRowClick} expense={expense} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'balances' && (
                        <div className="pt-4 text-center">
                            <p className="text-slate-500">Balances feature coming soon.</p>
                        </div>
                    )}
                </div>

                {/* FAB */}
                {activeTab === 'expenses' && (
                    <button
                        onClick={() => navigate('/expenses/new')}
                        className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95 z-40"
                    >
                        <Plus size={28} />
                    </button>
                )}

                {/* Expense Modal */}
                {isExpenseModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="w-full max-w-lg">
                            <ExpenseForm
                                groupId={group.id}
                                onSuccess={() => setIsExpenseModalOpen(false)}
                                onCancel={() => setIsExpenseModalOpen(false)}
                            />
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}

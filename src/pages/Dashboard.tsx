import { Plus, TrendingUp, TrendingDown, Bell } from 'lucide-react';
import { MainLayout } from '../components/Layout/MainLayout';
import { useExpenses } from '../hooks/useExpenses';
import { useNavigate } from 'react-router-dom';
import { HeaderLayout } from '../components/Layout/HeaderLayout';
import { Button } from '../components/UI/Button';
import { FinancialCard } from '../components/Dashboard/FinancialCard';
import { ExpenseRow } from '../components/Expense/ExpenseRow';
import { BudgetOverviewCard } from '../components/Dashboard/BudgetOverviewCard';
import { HeaderSearchInput } from '../components/UI/HeaderSearchInput';
import { ExpenseRowSettled } from '../components/Expense/ExpenseRowSettled';
import { useCallback } from 'react';
import { useUsers } from '../hooks/useUsers';
import { useSettledExpenses } from '../hooks/useSettledExpense';
import { ErrorDisplay } from '../components/UI/ErrorDisplay';
import { Loader } from '../components/UI/Loader';
export function Dashboard() {
    const { data: expenses, isLoading, error } = useExpenses();
    const { data: settledExpenses, isLoading: settledExpensesLoading, error: settledExpensesError } = useSettledExpenses();
    const navigate = useNavigate();
    const { data: users } = useUsers();

    const handleRowClick = useCallback((id: string) => {
        navigate(`/expenses/view/${id}`);
    }, [navigate]);

    const handleRowClickSettled = useCallback((id: string) => {
        navigate(`/expenses/settle/view/${id}`);
    }, [navigate]);


    if (isLoading || settledExpensesLoading) {
        return <Loader size='lg' text='Loading...' />
    }
    else if (error || settledExpensesError) {
        return <ErrorDisplay message="Failed to load expense details." />
    }


    return (
        <MainLayout>
            <div className="space-y-8">
                {/* Header */}
                <HeaderLayout title="Financial Overview" description="Welcome back, here's what's happening with your money." size="md">
                    <HeaderSearchInput placeholder="Search transactions..." />
                    <button className="text-slate-400 hover:text-slate-600 relative">
                        <Bell size={20} />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-50"></span>
                    </button>
                    <Button
                        onClick={() => navigate('/expenses/new')}
                        icon={<Plus size={20} />}
                    >
                        New Transaction
                    </Button>
                </HeaderLayout>

                {/* Financial Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Balance */}
                    <FinancialCard title="Total Balance" amount={48250} description="Updated 5 mins ago" percentage={2.4}
                        icon={
                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
                                <TrendingUp size={24} />
                            </div>
                        }
                    />

                    {/* Monthly Income */}
                    <FinancialCard title="Monthly Income" amount={7400} description="Updated 5 mins ago" percentage={12}
                        icon={
                            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
                                <TrendingUp size={24} />
                            </div>
                        }
                    />

                    {/* Monthly Expenses */}
                    <FinancialCard title="Monthly Expenses" amount={3120.45} description="Updated 5 mins ago" percentage={-5}
                        icon={
                            <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 mb-4">
                                <TrendingDown size={24} />
                            </div>
                        }
                    />
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Transactions */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 glass-morphism rounded-2xl p-6 transition-all hover:shadow-2xl">
                        {isLoading || settledExpensesLoading ? (
                            <Loader size='lg' text='Loading Expenses...' />
                        ) : error || settledExpensesError ? (
                            <ErrorDisplay message="Failed to load expense details." />
                        ) : (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-slate-900">Recent Expenses</h3>
                                    <button className="text-sm font-medium text-primary-600 hover:text-primary-700" onClick={() => navigate('/expenses')}>View All</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <div className="w-full">
                                        <div className="divide-y divide-slate-50">
                                            {expenses?.slice(0, 6).map(expense => (
                                                <div key={expense.id}>
                                                    {expense.isSettled ? (
                                                        <ExpenseRowSettled
                                                            onClick={handleRowClickSettled}
                                                            expense={expense}
                                                            settledExpense={settledExpenses?.find(se => String(se.expenseId) === String(expense.id)) as any}
                                                            users={users}
                                                        />
                                                    ) : (
                                                        <ExpenseRow onClick={handleRowClick} expense={expense} />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <BudgetOverviewCard totalSpent={200} remainingAmount={70} />
                </div>

            </div>
        </MainLayout>
    );
}

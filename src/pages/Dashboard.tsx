import { useCallback, useMemo } from 'react';
import { Plus, TrendingUp, TrendingDown, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/Layout/MainLayout';
import { HeaderLayout } from '../components/Layout/HeaderLayout';
import { Button } from '../components/UI/Button';
import { FinancialCard } from '../components/Dashboard/FinancialCard';
import { BudgetOverviewCard } from '../components/Dashboard/BudgetOverviewCard';
import { HeaderSearchInput } from '../components/UI/HeaderSearchInput';
import { Loader } from '../components/UI/Loader';
import { Message } from '../components/UI/Message';
import { ExpenseRowsByDate } from '../components/Expense/ExpenseRowsByDate';
import { useFilterExpenseRows } from '../hooks/useExpenses';
import { Filter_ALL, type ExpenseRow, type ExpenseRowYearWise, type ExpenseRowMonthWise, type ExpenseRowDayWise } from '../domain/models';

export function Dashboard() {
    const navigate = useNavigate();
    const { data: recentExpenseRows, isLoading } = useFilterExpenseRows({
        title: '',
        groupId: Filter_ALL,
        expenseCategoryId: Filter_ALL,
        isShared: Filter_ALL,
        limit: 5,
    });

    const handleExpenseClick = useCallback((expense: ExpenseRow) => {
        if (expense.isSettled) {
            navigate(`/expenses/settle/view/${expense.id}`);
            return;
        }
        navigate(`/expenses/view/${expense.id}`);
    }, [navigate]);

    const recentExpenseRowsLimited = useMemo<ExpenseRowYearWise[]>(() => {
        if (!recentExpenseRows || recentExpenseRows.length === 0) return [];

        const limitedFlatRows: ExpenseRow[] = [];
        for (const year of recentExpenseRows) {
            for (const month of year.expensesPerYear) {
                for (const day of month.expensesPerMonth) {
                    for (const expense of day.expensesPerDay) {
                        if (limitedFlatRows.length >= 10) break;
                        limitedFlatRows.push(expense);
                    }
                    if (limitedFlatRows.length >= 10) break;
                }
                if (limitedFlatRows.length >= 10) break;
            }
            if (limitedFlatRows.length >= 10) break;
        }

        const groupedByYear = new Map<number, Map<number, Map<number, ExpenseRow[]>>>();
        for (const expense of limitedFlatRows) {
            const date = new Date(expense.expenseDate);
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();

            let months = groupedByYear.get(year);
            if (!months) {
                months = new Map<number, Map<number, ExpenseRow[]>>();
                groupedByYear.set(year, months);
            }
            let days = months.get(month);
            if (!days) {
                days = new Map<number, ExpenseRow[]>();
                months.set(month, days);
            }
            let expenses = days.get(day);
            if (!expenses) {
                expenses = [];
                days.set(day, expenses);
            }
            expenses.push(expense);
        }

        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December',
        ];

        return Array.from(groupedByYear.entries())
            .sort(([a], [b]) => b - a)
            .map(([year, months]) => {
                const expensesPerYear: ExpenseRowMonthWise[] = Array.from(months.entries())
                    .sort(([a], [b]) => b - a)
                    .map(([monthIndex, days]) => {
                        const expensesPerMonth: ExpenseRowDayWise[] = Array.from(days.entries())
                            .sort(([a], [b]) => b - a)
                            .map(([day, expensesPerDay]) => ({ day, expensesPerDay }));
                        return {
                            month: monthNames[monthIndex] ?? 'Unknown',
                            expensesPerMonth,
                        };
                    });
                return {
                    year,
                    expensesPerYear,
                };
            });
    }, [recentExpenseRows]);

    return (
        <MainLayout>
            <div className="space-y-8">
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FinancialCard title="Total Balance" amount={48250} description="Updated 5 mins ago" percentage={2.4}
                        icon={
                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
                                <TrendingUp size={24} />
                            </div>
                        }
                    />

                    <FinancialCard title="Monthly Income" amount={7400} description="Updated 5 mins ago" percentage={12}
                        icon={
                            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
                                <TrendingUp size={24} />
                            </div>
                        }
                    />

                    <FinancialCard title="Monthly Expenses" amount={3120.45} description="Updated 5 mins ago" percentage={-5}
                        icon={
                            <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 mb-4">
                                <TrendingDown size={24} />
                            </div>
                        }
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 glass-morphism rounded-2xl p-6 transition-all hover:shadow-2xl">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="text-lg font-bold text-slate-900">Recent Expenses</h3>
                            <button className="text-sm font-medium text-primary-600 hover:text-primary-700" onClick={() => navigate('/expenses')}>View All</button>
                        </div>

                        {isLoading ? (
                            <Loader size='lg' text='Loading Expenses...' />
                        ) : !recentExpenseRows || recentExpenseRows.length === 0 ? (
                            <Message message="No expenses found." />
                        ) : (
                            <ExpenseRowsByDate
                                rows={recentExpenseRowsLimited}
                                onExpenseClick={handleExpenseClick}
                                compact
                                listHeight={420}
                            />
                        )}
                    </div>

                    <BudgetOverviewCard totalSpent={200} remainingAmount={70} />
                </div>
            </div>
        </MainLayout>
    );
}

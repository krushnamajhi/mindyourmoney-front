import { useState, useCallback } from 'react';
import { Plus, Download, ArrowUpDown, Wallet } from 'lucide-react';
import { MainLayout } from '../components/Layout/MainLayout';
import { useFilterExpenseRows } from '../hooks/useExpenses';
import { useSettings } from '../context/SettingsContext';
import { HeaderLayout } from '../components/Layout/HeaderLayout';
import { Button } from '../components/UI/Button';
import { ExpenseFilter } from '../components/Expense/ExpenseFilter';
import { Filter_ALL, type ExpenseFilters, type ExpenseRow } from '../domain/models';
import { useNavigate } from 'react-router-dom';
import { ExpenseRowsByDate } from '../components/Expense/ExpenseRowsByDate';

export function ExpensesPage() {
    const { formatCurrency } = useSettings();
    const navigate = useNavigate();

    // Filter States
    const [activeFilters, setActiveFilters] = useState<ExpenseFilters>({
        title: '',
        groupId: Filter_ALL,
        expenseCategoryId: Filter_ALL,
        isShared: Filter_ALL,
        startDate: undefined,
        endDate: undefined
    });

    const { data: expenseRowsByYear, isLoading } = useFilterExpenseRows(activeFilters as any);

    const handleFilter = (filters: ExpenseFilters) => {
        setActiveFilters(filters);
    };

    const handleRowClick = useCallback((expense: ExpenseRow) => {
        if (expense.isSettled) {
            navigate(`/expenses/settle/view/${expense.id}`);
            return;
        }
        navigate(`/expenses/view/${expense.id}`);
    }, [navigate]);

    return (
        <MainLayout>
            <div className="space-y-6">
                <HeaderLayout title="Transactions" description="Manage and track your recent financial activities." size="md">
                    <Button className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2" icon={<Download size={18} />}>
                        Export CSV
                    </Button>
                    <Button icon={<Plus size={18} />}>
                        New Expense
                    </Button>
                </HeaderLayout>

                <ExpenseFilter onFilter={handleFilter} />

                {/* Virtualized Transactions List */}
                <div
                    className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
                >
                    {isLoading ? (
                        <div className="px-6 py-12 text-center text-slate-500">
                            Loading transactions...
                        </div>
                    ) : (
                        <ExpenseRowsByDate rows={expenseRowsByYear || []} onExpenseClick={handleRowClick} />
                    )}
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard
                        label="Total Amount Received"
                        value={formatCurrency(12450)}
                        icon={<div className="text-emerald-500 bg-emerald-50 p-3 rounded-full"><ArrowUpDown size={24} /></div>}
                    />
                    <StatCard
                        label="Total Amount Spent"
                        value={formatCurrency(8210.45)}
                        icon={<div className="text-rose-500 bg-rose-50 p-3 rounded-full"><ArrowUpDown size={24} /></div>}
                    />
                    <div className="bg-primary-900 rounded-xl p-6 text-white flex items-center justify-between shadow-lg shadow-primary-900/20">
                        <div>
                            <p className="text-primary-200 text-xs font-bold uppercase tracking-wider mb-1">Net Balance</p>
                            <p className="text-3xl font-bold">{formatCurrency(4239.55)}</p>
                        </div>
                        <div className="bg-white/10 p-3 rounded-full">
                            <Wallet size={24} />
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

function StatCard({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
                <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
            </div>
            {icon}
        </div>
    )
}

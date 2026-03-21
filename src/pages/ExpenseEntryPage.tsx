import { useNavigate, useSearchParams } from 'react-router-dom';
import { MainLayout } from '../components/Layout/MainLayout';
import { ExpenseForm } from '../components/Expense/ExpenseForm';
import BackArrow from '../components/UI/BackArrow';
import FormHeader from '../components/UI/FormHeader';
// import { clsx } from 'clsx';

export function ExpenseEntryPage() {
    const [searchParams] = useSearchParams();
    const expenseId = searchParams.get('id') ? Number(searchParams.get('id')) : undefined;
    const edit = searchParams.get('edit');
    const navigate = useNavigate();
    const isEditMode = !!expenseId && edit === 'true';

    // Tabs logic removed, defaulting to standard view

    return (
        <MainLayout>
            <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
                {/* Header */}
                <div className="flex items-center space-y-2">
                    <BackArrow navigation={`/expenses`} />
                    <FormHeader
                        title={isEditMode ? 'Edit Expense' : 'New Expense'}
                        description={isEditMode ? 'Update the details of your expense' : 'Fill in the details below to record your spending'}
                    />
                </div>
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                    <ExpenseForm
                        expenseId={expenseId}
                        isSharedInitial={false}
                        onSuccess={() => navigate('/expenses')}
                        onCancel={() => navigate(-1)}
                    />
                </div>
            </div>
        </MainLayout>
    );
}

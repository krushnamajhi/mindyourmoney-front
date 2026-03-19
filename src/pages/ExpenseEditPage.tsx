import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/Layout/MainLayout';
import { ExpenseForm } from '../components/Expense/ExpenseForm';
import BackArrow from '../components/UI/BackArrow';
import FormHeader from '../components/UI/FormHeader';
import { useDeleteExpense, useExpenseEditability } from '../hooks/useExpenses';
import MenuContainer from '../components/Containers/Menu/MenuContainer';
import DeleteMenuOption from '../components/UI/Menu/MenuOptions/DeleteMenuOption';
import ViewMenuOption from '../components/UI/Menu/MenuOptions/ViewMenuOption';
import { Loader } from '../components/UI/Loader';
import { ErrorDisplay } from '../components/UI/ErrorDisplay';
import type { APIError } from '../lib/ErrorTypes';

export function ExpenseEditPage() {
    const { expenseId } = useParams();
    const navigate = useNavigate();
    const handleDelete = () => {
        if (expenseId) {
            deleteExpense.mutate(expenseId.toString());
            navigate(-1);
        }
    };
    const deleteExpense = useDeleteExpense();

    const renderMenu = () => {
        return (<MenuContainer id={expenseId || ''} compact={true} size={'large'}>
            <ViewMenuOption onClick={(e) => {
                e.stopPropagation();
                navigate(`/expenses/view/${expenseId}`);
            }} />
            <DeleteMenuOption onClick={(e) => {
                e.stopPropagation();
                handleDelete();
            }} />
        </MenuContainer>)
    }

    // Tabs logic removed, defaulting to standard view
    const editabilityQuery = useExpenseEditability(expenseId || '');
    const isEditable = editabilityQuery.data?.editable ?? true;
    const notEditableMessage = editabilityQuery.data?.message;
    const apiError = editabilityQuery.error as APIError | undefined;
    const errorMessage = apiError?.errors?.[0] || apiError?.message || 'Failed to check if expense is editable.';

    return (
        <MainLayout>
            <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
                {/* Header */}
                <div className="flex items-center space-y-2">
                    <BackArrow navigation={`/expenses`} />
                    <FormHeader
                        title={'Edit Expense'}
                        description={'Update the details of your expense'}
                    />
                    <div className="ml-auto">
                        {renderMenu()}
                    </div>
                </div>
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                    {editabilityQuery.isLoading ? (
                        <Loader size="lg" text="Checking if expense is editable..." />
                    ) : editabilityQuery.isError ? (
                        <ErrorDisplay message={errorMessage} onRetry={() => editabilityQuery.refetch()} />
                    ) : isEditable ? (
                        <ExpenseForm
                            expenseId={expenseId}
                            isSharedInitial={false}
                            onSuccess={() => navigate('/expenses')}
                            onCancel={() => navigate(-1)}
                        />
                    ) : (
                        <ErrorDisplay
                            title="Expense not editable"
                            message={notEditableMessage || 'This expense cannot be edited.'}
                        />
                    )}
                </div>
            </div>
        </MainLayout>
    );
}

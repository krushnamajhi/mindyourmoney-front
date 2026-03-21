import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/Layout/MainLayout';
import BackArrow from '../components/UI/BackArrow';
import FormHeader from '../components/UI/FormHeader';
import { useDeleteExpense, useExpenseEditability } from '../hooks/useExpenses';
import MenuContainer from '../components/Containers/Menu/MenuContainer';
import DeleteMenuOption from '../components/UI/Menu/MenuOptions/DeleteMenuOption';
import { ExpenseView } from '../components/Expense/ExpenseView';
import EditMenuOption from '../components/UI/Menu/MenuOptions/EditMenuOption';

export function ExpenseViewPage() {
    const expenseId= Number(useParams().expenseId);
    const navigate = useNavigate();
    const { data } = expenseId ? useExpenseEditability(expenseId) : {data : undefined };
    const notEditable = data?.editable === false;
    const notEditableMessage = data?.message;

    const handleDelete = () => {
        if (expenseId) {
            deleteExpense.mutate(expenseId);
            navigate(-1);
        }
    };
    const deleteExpense = useDeleteExpense();

    const renderMenu = () => {
        return (<MenuContainer id={expenseId} compact={true} size={'large'}>
            <EditMenuOption onClick={(e) => {
                e.stopPropagation();
                navigate(`/expenses/edit/${expenseId}`);
            }} />
            <DeleteMenuOption onClick={(e) => {
                e.stopPropagation();
                handleDelete();
            }} />
        </MenuContainer>)
    }

    // Tabs logic removed, defaulting to standard view

    return (
        <MainLayout>
            <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
                {/* Header */}
                <div className="flex items-center space-y-2">
                    <BackArrow navigation={`/expenses`} />
                    <FormHeader
                        title={'View Expense'}
                        description={'View the details of your expense'}
                    />
                    <div className="ml-auto">
                        {!notEditable ? renderMenu() : null}
                    </div>
                </div>
                {notEditable ? (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900 text-sm">
                        {notEditableMessage || 'This expense is not editable.'}
                    </div>
                ) : null}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                    <ExpenseView
                        expenseId={expenseId}
                        onClose={() => navigate(-1)}
                    />
                </div>
            </div>
        </MainLayout>
    );
}

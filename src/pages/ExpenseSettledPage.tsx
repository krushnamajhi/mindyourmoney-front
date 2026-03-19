import { useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { MainLayout } from '../components/Layout/MainLayout';
import { ExpenseSettleForm } from '../components/Expense/ExpenseSettleForm';
import BackArrow from '../components/UI/BackArrow';
import FormHeader from '../components/UI/FormHeader';
import { useDeleteSettledExpense } from '../hooks/useSettledExpense';
import MenuContainer from '../components/Containers/Menu/MenuContainer';
import DeleteMenuOption from '../components/UI/Menu/MenuOptions/DeleteMenuOption';
import EditMenuOption from '../components/UI/Menu/MenuOptions/EditMenuOption';
import ViewMenuOption from '../components/UI/Menu/MenuOptions/ViewMenuOption';
import type { SettleExpenseDto } from '../domain/models';
import { useAuth } from '../context/AuthContext';
import { useExpenseEditability } from '../hooks/useExpenses';
import { Loader } from '../components/UI/Loader';
import { ErrorDisplay } from '../components/UI/ErrorDisplay';
import type { APIError } from '../lib/ErrorTypes';

type PageMode = 'new' | 'edit' | 'view';

function resolveMode(pathname: string): PageMode {
    if (pathname.includes('/settle/edit/')) return 'edit';
    if (pathname.includes('/settle/view/')) return 'view';
    return 'new';
}

const pageConfig: Record<PageMode, { title: string; description: string }> = {
    new: { title: 'Record Settlement', description: 'Record a payment between two members' },
    edit: { title: 'Edit Settlement', description: 'Update the settlement details' },
    view: { title: 'View Settlement', description: 'Review the settlement details' },
};

export function ExpenseSettledPage() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const mode = resolveMode(location.pathname);
    const isViewOnly = mode === 'view';
    const expenseId = mode === 'new' ? null : id;
    const editabilityQuery = useExpenseEditability(mode === 'new' ? '' : (id || ''));
    const notEditable = mode !== 'new' && editabilityQuery.data?.editable === false;
    const notEditableMessage = editabilityQuery.data?.message;
    const apiError = editabilityQuery.error as APIError | undefined;
    const editabilityErrorMessage = apiError?.errors?.[0] || apiError?.message || 'Failed to check if settlement is editable.';
    const passedData: SettleExpenseDto = {
        amount: searchParams.get('amount') ? Number(searchParams.get('amount')) : 0,
        paidByUserId: searchParams.get('paidByUserId') ? Number(searchParams.get('paidByUserId')) : Number(user?.id) || -1,
        groupId: searchParams.get('groupId') ? Number(searchParams.get('groupId')) : undefined,
        settledMemberId: searchParams.get('settledMemberId') ? Number(searchParams.get('settledMemberId')) : -1,
    };

    const deleteExpense = useDeleteSettledExpense();

    const handleDelete = () => {
        if (id) {
            deleteExpense.mutate(id);
            navigate('/expenses');
        }
    };

    const renderMenu = () => {
        if (mode === 'new') return null;

        return (
            <MenuContainer id={id || ''} compact={true} size={'large'}>
                {mode === 'view' && (
                    <EditMenuOption onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/expenses/settle/edit/${id}`);
                    }} />
                )}
                {mode === 'edit' && (
                    <ViewMenuOption onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/expenses/settle/view/${id}`);
                    }} />
                )}
                <DeleteMenuOption onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                }} />
            </MenuContainer>
        );
    };

    const { title, description } = pageConfig[mode];

    return (
        <MainLayout>
            <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
                {/* Header */}
                <div className="flex items-center space-y-2">
                    <BackArrow navigation={`/expenses`} />
                    <FormHeader
                        title={title}
                        description={description}
                    />
                    <div className="ml-auto">
                        {!notEditable ? renderMenu() : null}
                    </div>
                </div>
                {notEditable ? (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900 text-sm">
                        {notEditableMessage || 'This settlement is not editable.'}
                    </div>
                ) : null}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                    {mode !== 'new' && editabilityQuery.isLoading ? (
                        <Loader size="lg" text="Checking if settlement is editable..." />
                    ) : mode !== 'new' && editabilityQuery.isError ? (
                        <ErrorDisplay message={editabilityErrorMessage} onRetry={() => editabilityQuery.refetch()} />
                    ) : mode === 'edit' && notEditable ? (
                        <ErrorDisplay
                            title="Settlement not editable"
                            message={notEditableMessage || 'This settlement cannot be edited.'}
                        />
                    ) : (
                        <ExpenseSettleForm
                            passedData={passedData}
                            expenseId={expenseId}
                            onSuccess={() => navigate('/expenses')}
                            onCancel={() => navigate(-1)}
                            isViewOnly={isViewOnly}
                        />
                    )}
                </div>
            </div>
        </MainLayout>
    );
}

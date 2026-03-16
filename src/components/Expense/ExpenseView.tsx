import { ExpenseForm } from './ExpenseForm';

interface ExpenseViewProps {
    expenseId: string;
    onClose: () => void;
}

export function ExpenseView({ expenseId, onClose }: ExpenseViewProps) {
    return (
        <div className="h-full overflow-y-auto">
            <ExpenseForm 
                expenseId={expenseId} 
                isViewOnly={true} 
                onCancel={onClose} 
            />
        </div>
    );
}

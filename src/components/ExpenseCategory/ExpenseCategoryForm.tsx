import { useState, useEffect } from 'react';
import { useCreateExpenseCategory, useUpdateExpenseCategory } from '../../hooks/useExpenseCategories';
import type { ExpenseCategoryModel } from '../../domain/models';
import ModalContainer from '../Containers/Modal/ModalContainer';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { closeModal } from '../../store/modalSlice';
import { useFormErrorsUI } from '../../hooks/UI/useFormErrorsUI';

export function ExpenseCategoryForm() {
    const { isOpen, modalId, data: modalData } = useAppSelector((state) => state.modal);
    const category = modalData?.extraData?.category as ExpenseCategoryModel | undefined;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const { setFormErrors, renderError } = useFormErrorsUI();
    const dispatch = useAppDispatch();

    const createMutation = useCreateExpenseCategory();
    const updateMutation = useUpdateExpenseCategory();

    useEffect(() => {
        if (category) {
            setName(category.name);
            setDescription(category.description || '');
        } else {
            setName('');
            setDescription('');
        }
    }, [category, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (category) {
                await updateMutation.mutateAsync({
                    id: category.id,
                    updates: { name: name.trim(), description: description.trim() }
                });
            } else {
                await createMutation.mutateAsync({
                    name: name.trim(),
                    description: description.trim()
                });
            }
            dispatch(closeModal());
        } catch (err: any) {
            setFormErrors(err);
        }
    };

    if (!isOpen || modalId !== 'expense-category') return null;

    return (
        <ModalContainer>
            <form id="modal-form-expense-category" onSubmit={handleSubmit} className="space-y-4">
                {renderError()}

                <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest px-1">Category Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500/30 transition-all shadow-inner"
                        placeholder="e.g. Groceries, Subscriptions..."
                        autoFocus
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest px-1">Description (Optional)</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 font-medium placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500/30 transition-all resize-none shadow-inner"
                        placeholder="What does this category cover?"
                        rows={3}
                    />
                </div>
            </form>
        </ModalContainer>
    );
}

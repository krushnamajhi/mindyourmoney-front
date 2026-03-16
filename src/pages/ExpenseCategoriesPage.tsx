import { useState } from 'react';
import { Plus, Tag } from 'lucide-react';
import { MainLayout } from '../components/Layout/MainLayout';
import { HeaderLayout } from '../components/Layout/HeaderLayout';
import { Button } from '../components/UI/Button';
import { Loader } from '../components/UI/Loader';
import { ErrorDisplay } from '../components/UI/ErrorDisplay';
import { useExpenseCategories, useDeleteExpenseCategory } from '../hooks/useExpenseCategories';
import { ExpenseCategoryCard } from '../components/ExpenseCategory/ExpenseCategoryCard';
import { ExpenseCategoryForm } from '../components/ExpenseCategory/ExpenseCategoryForm';
import { ExpenseCategoryDetailsModal } from '../components/ExpenseCategory/ExpenseCategoryDetailsModal';
import type { ExpenseCategoryModel } from '../domain/models';
import { useAppDispatch } from '../store/hooks';
import { openModal } from '../store/modalSlice';

export function ExpenseCategoriesPage() {
    const { data: categories, isLoading, error } = useExpenseCategories();
    const deleteMutation = useDeleteExpenseCategory();

    const dispatch = useAppDispatch();
    const [viewingCategory, setViewingCategory] = useState<ExpenseCategoryModel | null>(null);

    const handleCreate = () => {
        dispatch(openModal({
            modalType: 'form',
            modalId: 'expense-category',
            data: {
                title: 'New Category',
                icon: 'Tag',
                description: 'Create a new spending category',
                submitLabel: 'Create Category',
            }
        }));
    };

    const handleEdit = (category: ExpenseCategoryModel) => {
        dispatch(openModal({
            modalType: 'form',
            modalId: 'expense-category',
            data: {
                title: 'Edit Category',
                icon: 'Tag',
                description: 'Update category details',
                submitLabel: 'Save Changes',
                extraData: { category }
            }
        }));
    };

    const handleView = (category: ExpenseCategoryModel) => {
        setViewingCategory(category);
    };

    const handleDelete = async (id: string) => {
        await deleteMutation.mutateAsync(id);
        setViewingCategory(null);
    };

    return (
        <MainLayout>
            <div className="space-y-6 relative">
                <ExpenseCategoryForm />

                {viewingCategory && (
                    <ExpenseCategoryDetailsModal
                        category={viewingCategory}
                        onClose={() => setViewingCategory(null)}
                        onDelete={handleDelete}
                    />
                )}

                <HeaderLayout
                    title="Expense Categories"
                    description="Organize your spending with custom categories."
                    size="md"
                >
                    <Button
                        onClick={handleCreate}
                        icon={<Plus size={20} />}
                    >
                        New Category
                    </Button>
                </HeaderLayout>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader size="lg" text="Loading categories..." />
                    </div>
                ) : error ? (
                    <ErrorDisplay message="Failed to load categories." />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {categories?.map((category) => (
                            <ExpenseCategoryCard
                                key={category.id}
                                category={category}
                                onView={handleView}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}

                        {/* Empty State */}
                        {categories?.length === 0 && (
                            <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white/40 border border-white/20 rounded-3xl backdrop-blur-sm shadow-inner">
                                <div className="p-4 bg-primary-50 text-primary-200 rounded-full mb-4">
                                    <Tag size={48} />
                                </div>
                                <h3 className="text-xl font-black text-slate-800 mb-2">No Categories Found</h3>
                                <p className="text-slate-500 font-medium mb-8">Start by creating your first expense category.</p>
                                <Button onClick={handleCreate} icon={<Plus size={20} />}>
                                    Create Category
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}

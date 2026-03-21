import { X, Trash2, Tag } from 'lucide-react';
import type { ExpenseCategoryModel } from '../../domain/models';
import { createPortal } from 'react-dom';

interface ExpenseCategoryDetailsModalProps {
    category: ExpenseCategoryModel;
    onClose: () => void;
    onDelete: (id: number) => void;
}

export function ExpenseCategoryDetailsModal({ category, onClose, onDelete }: ExpenseCategoryDetailsModalProps) {
    return (
        createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                    {/* Header */}
                    <div className="relative h-32 bg-primary-600 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
                            <div className="absolute bottom-0 right-0 w-48 h-48 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
                        </div>
                        <Tag size={48} className="text-white relative z-10 opacity-40" />
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 text-white rounded-xl transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-8 -mt-6">
                        <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 relative z-10 mb-6">
                            <h2 className="text-2xl font-black text-slate-800 mb-2 truncate">{category.name}</h2>
                            <p className="text-slate-500 font-medium text-sm leading-relaxed">
                                {category.description || 'No description provided for this category.'}
                            </p>
                        </div>
                        {/* Actions */}
                        <div className="flex flex-col space-y-3">
                            {category.createdUserId && (
                                <>
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to delete this category? This cannot be undone.')) {
                                                onDelete(category.id);
                                            }
                                        }}
                                        className="flex items-center justify-center space-x-2 py-4 text-red-600 hover:bg-red-50 rounded-2xl font-black text-sm transition-all border-2 border-transparent hover:border-red-100"
                                    >
                                        <Trash2 size={18} />
                                        <span>Delete Category</span>
                                    </button>
                                </>
                            )}
                            <button
                                onClick={onClose}
                                className="py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black text-sm transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>, document.body));
}

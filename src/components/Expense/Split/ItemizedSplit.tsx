import { useState } from 'react';
import { Plus, Trash2, Settings2 } from 'lucide-react';
import type { User, ExpenseItemLine, } from '../../../domain/models';
import { ItemSplitModal } from './ItemSplitModal';
import { cn } from '../../../utils/cn';

type UserWithActive = User & { isActive?: boolean };

interface ItemizedSplitProps {
    items: ExpenseItemLine[];
    members: UserWithActive[];
    onChange: (items: ExpenseItemLine[]) => void;
    isReadOnly?: boolean;
}

export function ItemizedSplit({ items, members, onChange, isReadOnly = false }: ItemizedSplitProps) {
    const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);

    const addItem = () => {
        if (isReadOnly) return;
        onChange([
            ...items,
            {
                name: '',
                amount: 0,
                splitType: 'EQUAL',
                isShared: true,
                debtMemberSplitsExpenseItemLines: members.map(m => ({ userId: m.id }))
            }
        ]);
    };

    const updateItem = (index: number, updates: Partial<ExpenseItemLine>) => {
        if (isReadOnly) return;
        const newItems = [...items];
        newItems[index] = { ...newItems[index], ...updates };
        onChange(newItems);
    };

    const removeItem = (index: number) => {
        if (isReadOnly) return;
        onChange(items.filter((_, i) => i !== index));
    };

    const totalAmount = items.reduce((sum, item) => sum + (item.amount || 0), 0);

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex justify-between items-center px-1">
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                    Itemized Breakdown
                </span>
                <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                    Total: ${totalAmount.toFixed(2)}
                </span>
            </div>

            <div className="space-y-3">
                {items.map((item, index) => (
                    <div key={index} className={cn(
                        "relative group bg-slate-50 border border-slate-100 rounded-2xl p-3 transition-all",
                        !isReadOnly && "hover:shadow-md hover:border-primary-200"
                    )}>
                        <div className="flex items-start gap-3">
                            <div className="flex-1 space-y-2">
                                <input
                                    type="text"
                                    value={item.name}
                                    readOnly={isReadOnly}
                                    onChange={(e) => updateItem(index, { name: e.target.value })}
                                    placeholder="Item name (e.g. Pizza)"
                                    className={cn(
                                        "w-full bg-transparent border-none p-0 text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:ring-0",
                                        isReadOnly && "cursor-default"
                                    )}
                                />
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-400">$</span>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        readOnly={isReadOnly}
                                        value={item.amount || ''}
                                        onChange={(e) => updateItem(index, { amount: parseFloat(e.target.value) || 0 })}
                                        className={cn(
                                            "w-24 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold focus:outline-none focus:border-primary-500",
                                            isReadOnly && "bg-transparent border-none p-0 cursor-default shadow-none"
                                        )}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingItemIndex(index)}
                                    className={cn(
                                        "flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors",
                                        item.splitType === 'EQUAL'
                                            ? "bg-slate-200 text-slate-600 hover:bg-slate-300"
                                            : "bg-primary-100 text-primary-700 hover:bg-primary-200",
                                        isReadOnly && "pointer-events-auto"
                                    )}
                                >
                                    <Settings2 size={12} />
                                    <span>{item.splitType === 'EQUAL' ? 'Split Equally' : `Split ${item.splitType}`}</span>
                                </button>
                                {!isReadOnly && (
                                    <button
                                        type="button"
                                        onClick={() => removeItem(index)}
                                        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {!isReadOnly && (
                    <button
                        type="button"
                        onClick={addItem}
                        className="w-full py-3 border-2 border-dashed border-slate-200 hover:border-primary-300 hover:bg-primary-50/50 rounded-2xl text-slate-400 hover:text-primary-600 font-bold text-sm transition-all flex items-center justify-center space-x-2"
                    >
                        <Plus size={16} strokeWidth={3} />
                        <span>Add Item</span>
                    </button>
                )}
            </div>

            {/* Config Modal */}
            {editingItemIndex !== null && items[editingItemIndex] && (
                <ItemSplitModal
                    isOpen={true}
                    onClose={() => { 
                        console.log('DEBUG: ItemizedSplit onClose called');
                        setEditingItemIndex(null);
                    }}
                    members={members}
                    item={items[editingItemIndex]}
                    initialSplitType={items[editingItemIndex].splitType}
                    onSave={(type, definitions) => {
                        updateItem(editingItemIndex, {
                            splitType: type,
                            debtMemberSplitsExpenseItemLines: definitions
                        });
                    }}
                    isReadOnly={isReadOnly}
                />
            )}
        </div>
    );
}

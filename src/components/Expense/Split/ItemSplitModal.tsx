import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save } from 'lucide-react';
import type { User, SplitType, DebtMemberSplitExpenseItemLine, ExpenseItemLine } from '../../../domain/models';
import { EqualSplit } from './EqualSplit';
import { PercentageSplit } from './PercentageSplit';
import { SharesSplit } from './SharesSplit';
import { UnequalSplit } from './UnequalSplit';
import { SplitTypeDropdown, splitTypeOptions } from '../../UI/SplitTypeDropdown';
// import { cn } from '../../../utils/cn';

interface ItemSplitModalProps {
    isOpen: boolean;
    onClose: () => void;
    members: User[];
    initialSplitType: SplitType;
    item: ExpenseItemLine;
    onSave: (splitType: SplitType, definitions: DebtMemberSplitExpenseItemLine[]) => void;
    isReadOnly?: boolean;
}

export function ItemSplitModal({
    isOpen,
    onClose,
    members,
    initialSplitType,
    item,
    onSave,
    isReadOnly = false
}: ItemSplitModalProps) {
    const [splitType, setSplitType] = useState<SplitType>(initialSplitType);
    const [definitions, setDefinitions] = useState<DebtMemberSplitExpenseItemLine[]>(item.debtMemberSplitsExpenseItemLines || []);
    const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(
        item.debtMemberSplitsExpenseItemLines?.map(d => d.userId) || []
    );

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setSplitType(initialSplitType);
            setDefinitions(item.debtMemberSplitsExpenseItemLines || []);
            setSelectedMemberIds(item.debtMemberSplitsExpenseItemLines?.map(d => d.userId) || []);
        }
        console.log(isReadOnly)
    }, [isOpen, initialSplitType, item.debtMemberSplitsExpenseItemLines]);

    // Handle Split Type Change - reset definitions smartly
    const handleSplitTypeChange = (type: SplitType) => {
        if (isReadOnly) return;
        setSplitType(type);
        // Reset definitions based on type if needed, or keep existing members
        if (type === 'EQUAL') {
            // Keep members, recalculate amounts implicit in EqualSplit
        } else {
            // For others, we might want to start fresh or convert
            // For now, let's reset values but keep members if possible?
            // Simplest: Reset to empty definitions for clarity, OR default to equal shares
            setDefinitions(selectedMemberIds.map(id => ({ userId: id })));
        }
    };

    const handleSave = () => {
        if (isReadOnly) return;
        onSave(splitType, definitions);
        onClose();
    };

    if (!isOpen) return null;

    const _splitTypeOptions = splitTypeOptions.filter(option => option.value !== 'ITEMS');

    const getItemName = () => {
        if (item.name) {
            return item.name;
        }
        return 'Untitled Item';
    };
    // Filter "By Items" out of the selector for the modal itself (no nested items)
    // We can just render the selector and ignore 'ITEMS' or pass a prop to hide it.
    // For now, let's just handle the render logic here.

    return createPortal(
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => {
                console.log('DEBUG: ItemSplitModal backdrop clicked');
                onClose();
            }}
        >
            <div 
                className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-black text-slate-800">Split "{getItemName()}"</h3>
                        <p className="text-xs text-slate-500 font-bold">${item.amount.toFixed(2)}</p>
                    </div>
                    <button 
                        type="button"
                        onClick={() => {
                            console.log('DEBUG: ItemSplitModal X button clicked');
                            onClose();
                        }} 
                        className="p-2 text-slate-400 hover:text-slate-600 rounded-xl transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                    <SplitTypeDropdown
                        value={splitType}
                        onChange={handleSplitTypeChange}
                        options={_splitTypeOptions}
                        disabled={isReadOnly}
                    />

                    <div className="min-h-[200px]">
                        {splitType === 'EQUAL' && (
                            <EqualSplit
                                amount={item.amount}
                                members={members}
                                selectedMemberIds={selectedMemberIds}
                                onChange={(ids) => {
                                    setSelectedMemberIds(ids);
                                    // Definitions for EQUAL are just member IDs effectively,
                                    // but we store them as definitions for consistency
                                    setDefinitions(ids.map(id => ({ userId: id })));
                                }}
                                isReadOnly={isReadOnly}
                            />
                        )}
                        {splitType === 'PERCENT' && (
                            <PercentageSplit
                                amount={item.amount}
                                members={members}
                                definitions={definitions}
                                onChange={setDefinitions}
                                isReadOnly={isReadOnly}
                            />
                        )}
                        {splitType === 'SHARES' && (
                            <SharesSplit
                                amount={item.amount}
                                members={members}
                                definitions={definitions}
                                onChange={setDefinitions}
                                isReadOnly={isReadOnly}
                            />
                        )}
                        {splitType === 'EXACT' && (
                            <UnequalSplit
                                amount={item.amount}
                                members={members}
                                definitions={definitions}
                                onChange={setDefinitions}
                                isReadOnly={isReadOnly}
                            />
                        )}
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3">
                    {isReadOnly ? (
                        <button
                            type="button"
                            onClick={() => {
                                console.log('DEBUG: ItemSplitModal footer Close button clicked');
                                onClose();
                            }}
                            className="w-full py-3 bg-primary-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary-500/20 hover:bg-primary-800 transition-all flex items-center justify-center space-x-2"
                        >
                            <X size={16} />
                            <span>Close</span>
                        </button>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => {
                                    console.log('DEBUG: ItemSplitModal footer Cancel button clicked');
                                    onClose();
                                }}
                                className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    console.log('DEBUG: ItemSplitModal footer Save button clicked');
                                    handleSave();
                                }}
                                className="px-8 py-3 bg-primary-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-primary-500/20 hover:bg-primary-800 transition-all flex items-center space-x-2"
                            >
                                <Save size={16} />
                                <span>Save Split</span>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}

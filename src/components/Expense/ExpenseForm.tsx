import { useMemo, useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { Calendar, DollarSign, Euro, IndianRupee, JapaneseYen, ReceiptText, Users } from 'lucide-react';
import { useCreateExpense, useExpenseDetails, useUpdateExpense } from '../../hooks/useExpenses';
import { useExpenseCategories } from '../../hooks/useExpenseCategories';
import { useGroups } from '../../hooks/useGroups';
import { useUsers } from '../../hooks/useUsers';
import { CreateExpenseSchema, DebtMemberSplitsSchema, ExpenseItemLinesSchema, type ExpenseItemLine } from '../../domain/models';
import { cn } from '../../utils/cn';
import { getCategoryTheme } from '../../utils/categoryThemes';
import { EqualSplit } from './Split/EqualSplit';
import { CalendarWindow } from '../UI/CalendarWindow';
import { PercentageSplit } from './Split/PercentageSplit';
import { SharesSplit } from './Split/SharesSplit';
import { UnequalSplit } from './Split/UnequalSplit';
import { ItemizedSplit } from './Split/ItemizedSplit';
import { SplitTypeDropdown } from '../UI/SplitTypeDropdown';
import { Loader } from '../UI/Loader';
import { ErrorDisplay } from '../UI/ErrorDisplay';
import { useAuth } from '../../context/AuthContext';
import { useFormErrorsUI } from '../../hooks/UI/useFormErrorsUI';
import FormSelect from '../UI/Form/FormSelect';
import { useSettings } from '../../context/SettingsContext';
import FormInputTextArea from '../UI/Form/FormInputTextArea';
import FormInput from '../UI/Form/FormInput';
import { useNavigate } from 'react-router-dom';

const ErrorMsg = ({ error }: { error?: { message?: string } }) => {
    if (!error?.message) return null;
    return (
        <p className="text-red-500 text-[12px] font-semibold mt-1 px-1 tracking-tight">
            {error.message}
        </p>
    );
};

// --- Form Schema ---
const FormSchemaBase = CreateExpenseSchema.extend({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    amount: z.number().min(0.01, 'Amount must be greater than 0'),
    expenseDate: z.date({ error: 'Date is required' }),
    isShared: z.boolean(),
    groupId: z.string().optional().or(z.literal('')),
    expenseCategoryId: z.number().optional(),
    paidByUserId: z.number().or(z.string()).optional(),
    debtMemberSplits: z.array(DebtMemberSplitsSchema).optional(),
    expenseItemLines: z.array(ExpenseItemLinesSchema).optional()
});

type FormState = z.infer<typeof FormSchemaBase>;


interface ExpenseFormProps {
    groupId?: string;
    expenseId?: string | null | undefined;
    isSharedInitial?: boolean;
    onSuccess?: () => void;
    onCancel?: () => void;
    isViewOnly?: boolean;
}

export function ExpenseForm({ groupId, isSharedInitial = false, onSuccess, onCancel, expenseId, isViewOnly = false }: ExpenseFormProps) {

    const { user: currentUser } = useAuth();
    const { data: categories } = useExpenseCategories();
    const { data: groups } = useGroups();
    const { data: allUsers } = useUsers();
    const { data: expense, isLoading, error } = useExpenseDetails(expenseId || '');
    const createExpense = useCreateExpense(groupId || '');
    const updateExpense = useUpdateExpense(groupId || '');
    const isPending = createExpense.isPending;
    const { setFormErrors, renderError } = useFormErrorsUI();
    const { currency } = useSettings();
    const navigate = useNavigate();

    // ... (Memo/Effect code remains same, skipping for brevity but keeping in mind the structure)
    const defaultFormValues: FormState = useMemo(() => {
        if (expenseId && expense) {
            return {
                title: expense.title || '',
                description: expense.description || '',
                amount: expense.amount || 0,
                expenseDate: expense.expenseDate ? new Date(expense.expenseDate) : new Date(),
                isShared: expense.isShared || false,
                groupId: expense.groupId || '',
                expenseCategoryId: expense.expenseCategoryId || -1,
                paidByUserId: expense.paidByUserId || currentUser?.id,
                splitType: (expense.splitType as FormState['splitType']) || 'EQUAL',
                debtMemberSplits: expense.debtMemberSplits || [],
                expenseItemLines: expense.expenseItemLines || [],
            };
        }
        return {
            title: '',
            description: '',
            amount: 0,
            expenseDate: new Date(),
            isShared: isSharedInitial,
            groupId: groupId || '',
            expenseCategoryId: -1,
            paidByUserId: currentUser?.id,
            splitType: 'EQUAL',
            debtMemberSplits: [],
            expenseItemLines: [],
        };
    }, [expenseId, expense, isSharedInitial, groupId, currentUser?.id]);

    const {
        control,
        register,
        handleSubmit,
        watch,
        getValues,
        setValue,
        formState: { isSubmitting, errors }
    } = useForm<FormState>({
        defaultValues: defaultFormValues,
    });

    useEffect(() => {
        if (expenseId && expense) {
            const values = defaultFormValues;
            (Object.keys(values) as Array<keyof FormState>).forEach((key) => {
                setValue(key, values[key], { shouldValidate: true, shouldDirty: true, shouldTouch: true });
            });
        }
    }, [expense, expenseId, setValue, defaultFormValues]);

    const selectedGroupId = watch('groupId');
    const isShared = watch('isShared');
    const splitType = watch('splitType');
    const amount = watch('amount');
    const expenseDate = watch('expenseDate');

    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const calendarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setIsCalendarOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const availableMembers = useMemo(() => {
        if (!selectedGroupId || !groups) return allUsers || [];
        const group = groups.find(g => g.id == selectedGroupId);
        if (!group) return allUsers || [];
        return group.groupMembers || [];
    }, [selectedGroupId, groups, allUsers]);

    useEffect(() => {
        if (!isShared || availableMembers.length === 0 || isViewOnly) return;
        if (splitType === 'EQUAL') {
            if (getValues('debtMemberSplits')?.length === 0) {
                setValue('debtMemberSplits', availableMembers.map(m => ({ userId: m.id })));
            }
            else {
                const validIds = new Set(availableMembers.map(m => m.id));
                const currentSplits = getValues('debtMemberSplits') || [];
                const filtered = currentSplits.filter((s: { userId: string }) => validIds.has(s.userId));
                setValue('debtMemberSplits', filtered);
            }
        } else {
            const validIds = new Set(availableMembers.map(m => m.id));
            const currentSplits = getValues('debtMemberSplits') || [];
            const filtered = currentSplits.filter((s: { userId: string }) => validIds.has(s.userId));
            setValue('debtMemberSplits', filtered);
        }
    }, [isShared, availableMembers, splitType, setValue, getValues, isViewOnly]);

    const onSubmit = async (value: FormState) => {
        if (isViewOnly) return;
        let currentGroupMembers: string[] = [];
        if (value.groupId && groups) {
            const g = groups.find(grp => grp.id === value.groupId);
            if (g && g.groupMembers) {
                currentGroupMembers = g.groupMembers.map(m => m.id);
            }
        } else if (allUsers) {
            currentGroupMembers = allUsers.map(u => u.id);
        }

        const validMemberIds = new Set(availableMembers.map(m => m.id));
        const filteredDebtSplits = (value.debtMemberSplits || []).filter(
            (s: { userId: string }) => validMemberIds.has(s.userId)
        );

        const expenseItemLines = (value.expenseItemLines || []).map((expenseItemLine: ExpenseItemLine) => {
            return {
                ...expenseItemLine,
                debtMemberSplitsExpenseItemLines: expenseItemLine.debtMemberSplitsExpenseItemLines?.filter(
                    (s: { userId: string }) => validMemberIds.has(s.userId)
                )
            }
        })
        const payload = {
            ...value,
            expenseDate: value.expenseDate.toISOString(),
            groupMembers: currentGroupMembers,
            debtMemberSplits: filteredDebtSplits,
            expenseItemLines: expenseItemLines,
            paidByUserId: value.paidByUserId === '' ? null : value.paidByUserId,
            expenseCategoryId: value.expenseCategoryId == -1 ? null : Number(value.expenseCategoryId),
        };

        try {
            let id = expenseId
            console.log('payload', payload, id, expenseId);
            alert('payload');
            if (expenseId) {
                // @ts-ignore
                await updateExpense.mutateAsync({ id: expenseId, dto: payload, groupMembers: payload.groupMembers });
            } else {
                // @ts-ignore
                const expense = await createExpense.mutateAsync(payload);
                id = expense.id;
            }
            onSuccess?.();
            navigate(`/expenses/view/${id}`);
        } catch (error: any) {
            setFormErrors(error?.error as [], error?.errorType);
        }
    };

    if (expenseId && isLoading) {
        return (<Loader size='lg' text='Loading expense details...' />);
    }
    if (expenseId && error) {
        return (<ErrorDisplay message="Failed to load expense details." />);
    }

    const renderCurrencySymbol = () => {
        const className = cn("h-5 w-5 transition-colors", errors.amount ? "text-red-400" : "text-slate-400 group-focus-within:text-primary-500")
        if (currency == 'INR') return <IndianRupee className={className} />
        if (currency == 'USD') return <DollarSign className={className} />
        if (currency == 'EUR') return <Euro className={className} />
        if (currency == 'JPY') return <JapaneseYen className={className} />
        return <DollarSign className={className} />
    }

    return (
        <div className="flex flex-col h-full bg-slate-50/50">
            <form
                id="expense-form"
                onSubmit={handleSubmit(onSubmit)}
                className="p-6 md:p-8 space-y-8 flex-1"
            >
                {renderError()}

                {/* 1. Core Details */}
                <div className="space-y-6">
                    <FormInput data={{
                        label: 'Expense Title',
                        viewMode: isViewOnly,
                        viewModeValue: getValues('title'),
                        ...register('title'),
                        placeholder: "e.g. Dinner at Mario's",
                        className: cn(
                            "w-full text-lg font-bold placeholder:text-slate-300 border-0 border-b-2 bg-transparent transition-colors px-1 py-1.5 focus:ring-0",
                            errors.title ? "text-red-600 border-red-200 focus:border-red-500" : "text-slate-800 border-slate-100 focus:border-primary-500"
                        )
                    }} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput data={{
                            label: 'Amount',
                            type: 'amount',
                            viewMode: isViewOnly,
                            viewModeValue: getValues('amount'),
                            icon: renderCurrencySymbol(),
                            ...register('amount', { valueAsNumber: true }),
                            placeholder: "0.00"
                        }} />

                        <div className="space-y-2">
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest px-1">Date</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Calendar className={cn("h-5 w-5 transition-colors", errors.expenseDate ? "text-red-400" : "text-slate-400 group-focus-within:text-primary-500")} />
                                </div>
                                {isViewOnly ? (
                                    <div className="w-full pl-11 pr-5 text-slate-800 font-bold min-h-[50px] flex items-center">
                                        {expenseDate ? expenseDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'No Date'}
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                                            className={cn(
                                                "w-full pl-11 pr-4 py-3 border rounded-2xl font-bold focus:outline-none focus:ring-4 transition-all shadow-inner text-left flex items-center",
                                                errors.expenseDate
                                                    ? "bg-red-50 border-red-200 text-red-900 focus:ring-red-500/10 focus:border-red-500/30"
                                                    : "bg-slate-50 border-slate-100 text-slate-800 focus:ring-primary-500/10 focus:border-primary-500/30"
                                            )}
                                        >
                                            {expenseDate ? expenseDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'Select Date'}
                                        </button>
                                        {isCalendarOpen && (
                                            <div ref={calendarRef} className="absolute top-full left-0 mt-2 z-50 w-full md:w-auto">
                                                <CalendarWindow
                                                    value={expenseDate}
                                                    onChange={(date) => {
                                                        setValue('expenseDate', date);
                                                        setIsCalendarOpen(false);
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <FormInputTextArea data={{
                        label: 'Description (Optional)',
                        viewMode: isViewOnly,
                        ...register('description'),
                        placeholder: "Add more details..."
                    }} />
                </div>

                {/* 2. Category Selection */}
                <div>
                    <FormSelect
                        data={{
                            label: 'Category',
                            name: 'expenseCategoryId',
                            control,
                            viewMode: isViewOnly,
                            dataType: 'number',
                            options: [
                                { label: '🚫 None', value: '-1' },
                                ...(categories?.map(c => {
                                    const theme = getCategoryTheme(c.name);
                                    return { label: `${theme.icon} ${c.name}`, value: String(c.id) };
                                }) || [])
                            ],
                            placeholder: 'Select Category',
                        }}
                    />
                </div>

                {/* 3. Shared Logic */}
                <div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className={cn("p-2 rounded-xl transition-colors", isShared ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500")}>
                                <Users size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">Split this expense?</h3>
                                <p className="text-xs text-slate-500 font-medium">Share cost with others</p>
                            </div>
                        </div>
                        {!isViewOnly && (
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    {...register('isShared')}
                                />
                                <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        )}
                    </div>

                    {isShared && (
                        <div className="py-6 space-y-6 animate-in slide-in-from-top-4 fade-in duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormSelect
                                    data={{
                                        label: 'Group (Optional)',
                                        name: 'groupId',
                                        control,
                                        viewMode: isViewOnly,
                                        options: [
                                            { label: '👥 No Group (Individual Split)', value: '' },
                                            ...(groups?.map(g => ({ label: `🏠 ${g.name}`, value: g.id })) || [])
                                        ],
                                        placeholder: 'Select Group',
                                    }}
                                />
                                <FormSelect
                                    data={{
                                        label: 'Paid By',
                                        name: 'paidByUserId',
                                        control,
                                        viewMode: isViewOnly,
                                        dataType: 'string',
                                        options: availableMembers?.map(u => ({
                                            label: currentUser?.id === u.id ? `${u.fullName || 'User'} (You)` : (u.fullName || u.email),
                                            value: String(u.id)
                                        })) || [],
                                        placeholder: 'Select Payer',
                                    }}
                                />
                            </div>

                            {/* Split Strategy UI */}
                            <div className={cn("space-y-4 pt-4 border-t border-slate-100", isViewOnly && "pointer-events-none opacity-90")}>
                                <Controller
                                    name="splitType"
                                    control={control}
                                    render={({ field }) => (
                                        <SplitTypeDropdown
                                            value={field.value}
                                            onChange={(val: string) => field.onChange(val as any)}
                                        />
                                    )}
                                />

                                {/* Recursive Components based on Split Type */}
                                <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                                    {splitType === 'ITEMS' ? (
                                        <>
                                            <Controller
                                                name="expenseItemLines"
                                                control={control}
                                                render={({ field }) => (
                                                    <ItemizedSplit
                                                        items={field.value || []}
                                                        members={availableMembers}
                                                        onChange={field.onChange}
                                                        isReadOnly={isViewOnly}
                                                    />
                                                )}
                                            />
                                            <ErrorMsg error={errors.expenseItemLines} />
                                        </>
                                    ) : (
                                        <>
                                            <Controller
                                                name="debtMemberSplits"
                                                control={control}
                                                render={({ field }) => (
                                                    <>
                                                        {splitType === 'EQUAL' && (
                                                            <EqualSplit
                                                                amount={amount}
                                                                members={availableMembers}
                                                                selectedMemberIds={(field.value || []).map((d: { userId: string }) => d.userId)}
                                                                onChange={(ids) => field.onChange(ids.map(id => ({ userId: id })))}
                                                                isReadOnly={isViewOnly}
                                                            />
                                                        )}
                                                        {splitType === 'PERCENT' && (
                                                            <PercentageSplit
                                                                amount={amount}
                                                                members={availableMembers}
                                                                definitions={field.value || []}
                                                                onChange={field.onChange}
                                                                isReadOnly={isViewOnly}
                                                            />
                                                        )}
                                                        {splitType === 'SHARES' && (
                                                            <SharesSplit
                                                                amount={amount}
                                                                members={availableMembers}
                                                                definitions={field.value || []}
                                                                onChange={field.onChange}
                                                                isReadOnly={isViewOnly}
                                                            />
                                                        )}
                                                        {splitType === 'EXACT' && (
                                                            <UnequalSplit
                                                                amount={amount}
                                                                members={availableMembers}
                                                                definitions={field.value || []}
                                                                onChange={field.onChange}
                                                                isReadOnly={isViewOnly}
                                                            />
                                                        )}
                                                    </>
                                                )}
                                            />
                                            <ErrorMsg error={errors.debtMemberSplits} />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </form>

            {/* Footer Actions */}
            <div className="p-6 border-t border-slate-100 bg-white flex space-x-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
                <button
                    type="button"
                    onClick={onCancel}
                    className={cn(
                        "py-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-2xl font-black text-sm transition-all shadow-sm",
                        isViewOnly ? "w-full" : "flex-1"
                    )}
                >
                    {isViewOnly ? 'Close' : 'Cancel'}
                </button>
                {!isViewOnly && (
                    <button
                        type="submit"
                        form="expense-form"
                        disabled={isPending}
                        className="flex-[2] flex items-center justify-center space-x-2 py-4 bg-primary-900 hover:bg-primary-800 text-white rounded-2xl font-black text-sm shadow-xl shadow-primary-500/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting || isPending ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <ReceiptText size={18} />
                                <span>Save Expense</span>
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}

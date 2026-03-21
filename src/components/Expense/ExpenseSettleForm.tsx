import { useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { DollarSign, Euro, IndianRupee, JapaneseYen, Handshake } from 'lucide-react';
import { useGroupMembersByGroup, useGroups } from '../../hooks/useGroups';
import { useUsers } from '../../hooks/useUsers';
import { cn } from '../../utils/cn';
import { Loader } from '../UI/Loader';
import { ErrorDisplay } from '../UI/ErrorDisplay';
import { useAuth } from '../../context/AuthContext';
import { useFormErrorsUI } from '../../hooks/UI/useFormErrorsUI';
import FormSelect from '../UI/Form/FormSelect';
import { useSettings } from '../../context/SettingsContext';
import FormInput from '../UI/Form/FormInput';
import { useNavigate } from 'react-router-dom';
import { useCreateSettledExpense, useSettledExpense, useUpdateSettledExpense } from '../../hooks/useSettledExpense';
import type { SettleExpenseDto } from '../../domain/models';

// --- Form Schema ---
type SettleFormState = SettleExpenseDto;

interface ExpenseSettleFormProps {
    expenseId?: number | undefined;
    passedData?: SettleExpenseDto;
    onSuccess?: () => void;
    onCancel?: () => void;
    isViewOnly?: boolean;
}

export function ExpenseSettleForm({ expenseId, passedData, onSuccess, onCancel, isViewOnly = false }: ExpenseSettleFormProps) {
    const { user: currentUser } = useAuth();
    const { data: groups } = useGroups();
    const { data: allUsers } = useUsers();
    const { data: existingExpense, isLoading, error } = useSettledExpense(expenseId);
    const createSettle = useCreateSettledExpense();
    const updateSettle = useUpdateSettledExpense();
    const isPending = createSettle.isPending || updateSettle.isPending;
    const { setFormErrors, renderError } = useFormErrorsUI();
    const { currency } = useSettings();
    const navigate = useNavigate();
    console.log(passedData, isViewOnly);
    // --- Default Values ---
    const defaultFormValues: SettleFormState = useMemo(() => {
        if (expenseId && existingExpense) {
            return {
                amount: existingExpense.amount || 0,
                paidByUserId: existingExpense.paidByUserId || Number(currentUser?.id) || -1,
                groupId: existingExpense.groupId || undefined,
                settledMemberId: existingExpense.settledMemberId || -1,
            };
        }
        return passedData ? passedData : {
            amount: 0,
            paidByUserId: Number(currentUser?.id) || -1,
            groupId: undefined,
            settledMemberId: -1,
        };
    }, [expenseId, existingExpense, currentUser?.id, passedData]);

    const {
        control,
        register,
        handleSubmit,
        watch,
        getValues,
        setValue,
        formState: { isSubmitting, errors }
    } = useForm<SettleFormState>({
    });

    // Sync form when data loads
    useEffect(() => {
        console.log(passedData, 'passedData', expenseId, existingExpense);
        if (existingExpense || passedData) {
            const values = defaultFormValues;
            (Object.keys(values) as Array<keyof SettleFormState>).forEach((key) => {
                setValue(key, values[key], { shouldValidate: true, shouldDirty: true, shouldTouch: true });
            });
        }
    }, [existingExpense, expenseId, setValue, defaultFormValues, passedData, isViewOnly]);

    const selectedGroupId = watch('groupId');
    const paidByUserId = watch('paidByUserId');
    const settledMemberId = watch('settledMemberId');

    const { data: groupMembersByGroup } = useGroupMembersByGroup(
        selectedGroupId
    );

    // Derive available members from group or all users
    const availableMembers = useMemo(() => {
        if (!selectedGroupId || !groups) return allUsers || [];
        const group = groups.find(g => Number(g.id) == selectedGroupId);
        if (!group) return allUsers || [];
        const activeMembers = group.groupMembers || [];

        if (!isViewOnly || !groupMembersByGroup || groupMembersByGroup.length === 0) {
            return activeMembers;
        }

        const involvedMemberIds = new Set<string>();
        if (paidByUserId !== undefined && paidByUserId !== null && String(paidByUserId) !== '') {
            involvedMemberIds.add(String(paidByUserId));
        }
        if (settledMemberId !== undefined && settledMemberId !== null && String(settledMemberId) !== '') {
            involvedMemberIds.add(String(settledMemberId));
        }

        return groupMembersByGroup
            .filter((member) => member.isActive || involvedMemberIds.has(String(member.userId)))
            .map((member) => ({
                ...member.user,
                id: String(member.userId),
                isActive: member.isActive
            }));
    }, [selectedGroupId, groups, allUsers, isViewOnly, groupMembersByGroup, paidByUserId, settledMemberId]);

    // Filter out the payer from the settled member list
    const settleableMembers = useMemo(() => {
        return availableMembers.filter(m => Number(m.id) !== paidByUserId);
    }, [availableMembers, paidByUserId]);

    // --- Submit ---
    const onSubmit = async (value: SettleFormState) => {
        if (isViewOnly) return;
        const payload = {
            amount: value.amount,
            paidByUserId: value.paidByUserId,
            groupId: value.groupId || undefined,
            settledMemberId: value.settledMemberId,
        };

        try {
            if (expenseId) {
                await updateSettle.mutateAsync({ id: expenseId, dto: payload });
            } else {
                await createSettle.mutateAsync(payload);
            }
            onSuccess?.();
            navigate('/expenses');
        } catch (error: any) {
            setFormErrors(error);
        }
    };

    // --- Loading/Error States ---
    if (expenseId && isLoading) {
        return (<Loader size='lg' text='Loading settlement details...' />);
    }
    if (expenseId && error) {
        return (<ErrorDisplay message="Failed to load settlement details." />);
    }

    const renderCurrencySymbol = () => {
        const className = cn("h-5 w-5 transition-colors", errors.amount ? "text-red-400" : "text-slate-400 group-focus-within:text-primary-500")
        if (currency == 'INR') return <IndianRupee className={className} />
        if (currency == 'USD') return <DollarSign className={className} />
        if (currency == 'EUR') return <Euro className={className} />
        if (currency == 'JPY') return <JapaneseYen className={className} />
        return <DollarSign className={className} />
    }

    const onInvalid = (errors: any) => {
        console.error('Form Submission Failed - Validation Errors:', errors);
    };

    return (
        <div className="flex flex-col h-full bg-slate-50/50">
            <form
                id="settle-form"
                onSubmit={handleSubmit(onSubmit, onInvalid)}
                className="p-6 md:p-8 space-y-8 flex-1"
            >
                {renderError()}

                {/* Settlement Header Badge */}
                <div className="flex items-center space-x-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                    <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-600">
                        <Handshake size={22} />
                    </div>
                    <div>
                        <h3 className="font-bold text-emerald-800 text-sm">Settlement Record</h3>
                        <p className="text-xs text-emerald-600/70 font-medium">Record a payment between members</p>
                    </div>
                </div>

                {/* Fields */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <FormInput data={{
                            label: 'Amount',
                            type: 'amount',
                            viewMode: isViewOnly,
                            viewModeValue: getValues('amount'),
                            icon: renderCurrencySymbol(),
                            ...register('amount', { valueAsNumber: true }),
                            placeholder: "0.00"
                        }} />
                    </div>

                    <div className="space-y-4">
                        <FormSelect
                            data={{
                                label: 'Group (Optional)',
                                name: 'groupId',
                                control,
                                viewMode: isViewOnly || getValues('groupId') != undefined,
                                viewModeValue: getValues('groupId'),
                                options: [
                                    { label: '👥 No Group (Individual)', value: '' },
                                    ...(groups?.map(g => ({ label: `🏠 ${g.name}`, value: g.id })) || [])
                                ],
                                placeholder: 'Select Group',
                            }}
                        />
                    </div>

                    <div className="space-y-4">
                        <FormSelect
                            data={{
                                label: 'Paid By',
                                name: 'paidByUserId',
                                control,
                                viewMode: isViewOnly,
                                dataType: 'string',
                                options: availableMembers?.map(u => ({
                                    label: `${currentUser?.id === u.id ? `${u.fullName || 'User'} (You)` : (u.fullName || u.email)}${isViewOnly && (u as any).isActive === false ? ' (Inactive)' : ''}`,
                                    value: String(u.id)
                                })) || [],
                                placeholder: 'Who paid?',
                            }}
                        />
                    </div>

                    <div className="space-y-4">
                        <FormSelect
                            data={{
                                label: 'Settled To',
                                name: 'settledMemberId',
                                control,
                                viewMode: isViewOnly,
                                dataType: 'string',
                                options: settleableMembers?.map(u => ({
                                    label: `${currentUser?.id === u.id ? `${u.fullName || 'User'} (You)` : (u.fullName || u.email)}${isViewOnly && (u as any).isActive === false ? ' (Inactive)' : ''}`,
                                    value: String(u.id)
                                })) || [],
                                placeholder: 'Who received?',
                            }}
                        />
                    </div>
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
                        form="settle-form"
                        disabled={isPending}
                        className="flex-2 flex items-center justify-center space-x-2 py-4 bg-emerald-700 hover:bg-emerald-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting || isPending ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Handshake size={18} />
                                <span>{expenseId ? 'Update Settlement' : 'Record Settlement'}</span>
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}

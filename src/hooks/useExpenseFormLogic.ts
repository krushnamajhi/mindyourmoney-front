import { useMemo, useEffect } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useUsers } from '../hooks/useUsers';
import { useGroups } from '../hooks/useGroups';

export function useExpenseFormLogic(form: UseFormReturn<any>, isViewOnly: boolean = false) {
    const { user: currentUser } = useAuth();
    const { data: allUsers } = useUsers();
    const { data: groups } = useGroups();

    const { watch, setValue, getValues } = form;

    const selectedGroupId = watch('groupId');
    const isShared = watch('isShared');
    const splitType = watch('splitType');

    // 1. Calculate Available Members
    const availableMembers = useMemo(() => {
        if (!selectedGroupId || !groups) return allUsers || [];
        const group = groups.find(g => g.id == selectedGroupId);
        if (!group) return allUsers || [];
        return group.groupMembers || [];
    }, [selectedGroupId, groups, allUsers]);

    // 2. Sync Debt Member Splits when group/sharing changes
    useEffect(() => {
        if (!isShared || availableMembers.length === 0 || isViewOnly) return;
        
        const currentSplits = getValues('debtMemberSplits') || [];
        const validIds = new Set(availableMembers.map(m => m.id));
        
        // If EQUAL split and explicitly empty, initialize with all members
        if (splitType === 'EQUAL' && currentSplits.length === 0) {
            setValue('debtMemberSplits', availableMembers.map(m => ({ userId: m.id })));
        } else {
            // Otherwise, filter out members who are no longer in the group
            const filtered = currentSplits.filter((s: { userId: number }) => validIds.has(s.userId));
            // Only update if the length changed to avoid infinite loops
            if (filtered.length !== currentSplits.length) {
                setValue('debtMemberSplits', filtered);
            }
        }
    }, [isShared, availableMembers, splitType, setValue, getValues, isViewOnly]);

    // 3. Payload Formatter Logic (moved out of component)
    const formatPayload = (value: any) => {
        const validMemberIds = new Set(availableMembers.map(m => m.id));
        
        // Final filter for debt splits to ensure data integrity
        const filteredDebtSplits = (value.debtMemberSplits || []).filter(
            (s: { userId: number }) => validMemberIds.has(s.userId)
        );

        const expenseItemLines = (value.expenseItemLines || []).map((line: any) => ({
            ...line,
            debtMemberSplitsExpenseItemLines: line.debtMemberSplitsExpenseItemLines?.filter(
                (s: { userId: number }) => validMemberIds.has(s.userId)
            )
        }));

        let groupMembers: string[] = [];
        if (value.groupId && groups) {
            const g = groups.find(grp => grp.id === value.groupId);
            if (g && g.groupMembers) groupMembers = g.groupMembers.map(m => String(m.id));
        } else if (allUsers) {
            groupMembers = allUsers.map(u => String(u.id));
        }

        return {
            ...value,
            expenseDate: value.expenseDate.toISOString(),
            groupMembers,
            debtMemberSplits: filteredDebtSplits,
            expenseItemLines,
            paidByUserId: value.paidByUserId === '' ? null : value.paidByUserId,
            expenseCategoryId: value.expenseCategoryId == -1 ? null : Number(value.expenseCategoryId),
        };
    };

    return {
        availableMembers,
        currentUser,
        formatPayload,
        isShared,
        splitType,
        watch
    };
}

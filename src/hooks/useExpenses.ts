import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateExpenseDto, Expense, ExpenseFilters } from '../domain/models';
import { ExpenseService } from '../services/ExpenseService';

export function useExpenses() {
    return useQuery({
        queryKey: ['expenses'],
        queryFn: async () => {
            const res = await ExpenseService.getExpenses()
            console.log(res);
            return res;
        },
    });
}

export function useFilterExpenses(filters: ExpenseFilters) {
    return useQuery({
        queryKey: ['expenses', 'filter', filters],
        queryFn: () => ExpenseService.filterExpenses(filters),
    });
}

export function useExpensesByGroupId(groupId: string) {
    return useQuery({
        queryKey: ['expenses', groupId],
        queryFn: async () => {
            const res = await ExpenseService.getExpensesByGroupId(groupId)
            console.log(res);
            return res;
        },
        enabled: !!groupId,
    });
}

export function useCreateExpense(groupId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dto: CreateExpenseDto & { groupMembers: string[] }) =>
            ExpenseService.createExpense(dto, dto.groupMembers),

        // Optimistic Update
        onMutate: async (newExpenseData) => {
            await queryClient.cancelQueries({ queryKey: ['expenses', groupId] });

            const previousExpenses = queryClient.getQueryData<Expense[]>(['expenses', groupId]);

            // Optimistic Expense Object
            const optimisticExpense: any = {
                id: 'optimistic-' + Math.random(),
                ...newExpenseData,
                splits: [], // Simplified for preview
            };
            console.log(optimisticExpense);

            if (previousExpenses) {
                queryClient.setQueryData<Expense[]>(['expenses', groupId], [
                    ...previousExpenses,
                    optimisticExpense,
                ]);
            }

            return { previousExpenses };
        },

        onError: (_err, _newExpense, context) => {
            if (context?.previousExpenses) {
                queryClient.setQueryData(['expenses', groupId], context.previousExpenses);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses', groupId] });
        },
    });
}

export function useExpense(id: string) {
    return useQuery({
        queryKey: ['expenses', 'basic_details', id],
        queryFn: () => ExpenseService.getExpenseById(id),
        enabled: !!id,
    });
}

export function useExpenseDetails(id: string) {
    return useQuery({
        queryKey: ['expenses', 'full_details', id],
        queryFn: () => ExpenseService.getExpenseDetailsById(id),
        enabled: !!id,
    });
}

export function useUpdateExpense(groupId?: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, dto, groupMembers }: { id: string, dto: any, groupMembers: string[] }) =>
            ExpenseService.updateExpense(id, dto, groupMembers),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            if (groupId) {
                queryClient.invalidateQueries({ queryKey: ['expenses', groupId] });
            }
        },
    });
}


export function useDeleteExpense() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (expenseId: string) => ExpenseService.deleteExpense(expenseId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
        },
    });
}

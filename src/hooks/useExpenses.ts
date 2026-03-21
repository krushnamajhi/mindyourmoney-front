import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateExpenseDto, Expense, ExpenseFilters, ExpenseRowYearMonthWise, UpdateExpenseDto } from '../domain/models';
import { ExpenseService } from '../services/ExpenseService';
import { retryService } from '../utils/common';

export function useExpenses() {
    return useQuery({
        queryKey: ['expenses'],
        queryFn: async () => {
            const res = await ExpenseService.getExpenses()
            return res;
        },
        retry: retryService,
    });
}

export function useFilterExpenses(filters: ExpenseFilters) {
    return useQuery({
        queryKey: ['expenses', 'filter', filters],
        queryFn: () => ExpenseService.filterExpenses(filters),
    });
}

export function useFilterExpenseRows(filters: ExpenseFilters, enabled: boolean = true) {
    return useQuery<ExpenseRowYearMonthWise[]>({
        queryKey: ['expenses', 'filter', 'rows', filters],
        queryFn: () => ExpenseService.filterExpenseRows(filters),
        enabled,
    });
}

export function useExpensesByGroupId(groupId: number) {
    return useQuery({
        queryKey: ['expenses', groupId],
        queryFn: async () => {
            const res = await ExpenseService.getExpensesByGroupId(groupId)
            return res;
        },
        enabled: !!groupId,
        retry: retryService,
    });
}

export function useCreateExpense(groupId?: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dto: CreateExpenseDto) =>
            ExpenseService.createExpense(dto),

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

export function useExpense(id: number) {
    return useQuery({
        queryKey: ['expenses', 'basic_details', id],
        queryFn: () => ExpenseService.getExpenseById(id),
        enabled: !!id,
        retry: retryService,
    });
}

export function useExpenseDetails(id: number) {
    return useQuery({
        queryKey: ['expenses', 'full_details', id],
        queryFn: () => ExpenseService.getExpenseDetailsById(id),
        enabled: !!id,
        retry: retryService,
    });
}

export function useExpenseEditability(id: number) {
    return useQuery({
        queryKey: ['expenses', 'editable', id],
        queryFn: () => ExpenseService.getExpenseEditability(id),
        enabled: !!id,
        retry: retryService,
    });
}

export function useUpdateExpense(groupId?: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, dto }: { id: number, dto: UpdateExpenseDto }) =>
            ExpenseService.updateExpense(id, dto),
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
        mutationFn: (expenseId: number) => ExpenseService.deleteExpense(expenseId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
        },
        retry: retryService,
    });
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ExpenseService } from '../services/ExpenseService';
import type { SettleExpenseDto } from '../domain/models';
import { retryService } from '../utils/common';

export function useSettledExpense(id?: number) {
    return useQuery({
        queryKey: ['expenses', 'settled', id],
        queryFn: () => ExpenseService.getSettledExpenseDetailsById(id),
        enabled: !!id,
        retry: retryService,
    });
}

export function useSettledExpenses() {
    return useQuery({
        queryKey: ['expenses', 'settled'],
        queryFn: () => ExpenseService.getAllSettleExpenses(),
        retry: retryService,
    });
}

export function useCreateSettledExpense() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dto: SettleExpenseDto) =>
            ExpenseService.settleExpense(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses', 'settled'] });
        },
    });
}

export function useUpdateSettledExpense() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, dto }: { id: number; dto: SettleExpenseDto }) =>
            ExpenseService.updateSettledExpense(id, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses', 'settled'] });
        },
        retry: retryService,
    });
}

export function useDeleteSettledExpense() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => ExpenseService.deleteExpense(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses', 'settled'] });
        },
        retry: retryService,
    });
}

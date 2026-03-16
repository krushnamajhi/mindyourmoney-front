import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ExpenseService } from '../services/ExpenseService';
import type { SettleExpenseDto } from '../domain/models';

export function useSettledExpense(id: string) {
    return useQuery({
        queryKey: ['expenses', 'settled', id],
        queryFn: () => ExpenseService.getSettledExpenseDetailsById(id),
        enabled: !!id,
    });
}

export function useSettledExpenses() {
    return useQuery({
        queryKey: ['expenses', 'settled'],
        queryFn: () => ExpenseService.getAllSettleExpenses(),
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
        mutationFn: ({ id, dto }: { id: string; dto: SettleExpenseDto }) =>
            ExpenseService.updateSettledExpense(id, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses', 'settled'] });
        },
    });
}

export function useDeleteSettledExpense() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ExpenseService.deleteExpense(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses', 'settled'] });
        },
    });
}

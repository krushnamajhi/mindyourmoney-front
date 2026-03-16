import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ExpenseCategoryService } from '../services/ExpenseCategoryService';

export function useExpenseCategories() {
    return useQuery({
        queryKey: ['expense-categories'],
        queryFn: async () => await ExpenseCategoryService.getCategories(),
    });
}

export function useExpenseCategory(id: string) {
    return useQuery({
        queryKey: ['expense-categories', id],
        queryFn: async () => await ExpenseCategoryService.getCategoryById(id),
        enabled: !!id,
    });
}

export function useCreateExpenseCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { name: string; description?: string }) =>
            ExpenseCategoryService.createCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expense-categories'] });
        },
    });
}

export function useUpdateExpenseCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, updates }: { id: string, updates: { name?: string; description?: string } }) =>
            ExpenseCategoryService.updateCategory(id, updates),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['expense-categories'] });
            queryClient.invalidateQueries({ queryKey: ['expense-categories', variables.id] });
        },
    });
}

export function useDeleteExpenseCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => ExpenseCategoryService.deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expense-categories'] });
        },
    });
}

import { useQuery } from '@tanstack/react-query';
import { UserService } from '../services/UserService';

export function useUsers() {
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => await UserService.getUsers(),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useCurrentUser() {
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: async () => await UserService.getCurrentUser(),
        staleTime: Infinity,
    });
}

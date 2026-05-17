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

export function useSearchUser(searchedValue: string) {
    console.log("searching", searchedValue)
    return useQuery({
        queryKey: ['users', 'search', searchedValue],
        queryFn: async () => await UserService.searchUser(searchedValue),
        enabled: !!searchedValue && searchedValue.length >= 2,
        staleTime: 1, // 5 minutes
    });
}

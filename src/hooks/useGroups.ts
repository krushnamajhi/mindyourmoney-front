import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GroupService } from '../services/GroupService';
import type { Group, GroupMemberByGroup } from '../domain/models';
import { retryService } from '../utils/common';

export function useGroups() {
    return useQuery({
        queryKey: ['groups'],
        queryFn: async () => await GroupService.getGroups(),
    });
}

export function useGroup(id: number) {
    return useQuery({
        queryKey: ['groups', id],
        queryFn: async () => await GroupService.getGroupById(id),
        enabled: !!id,
        retry:retryService
    });
}

export function useGroupMembersByGroup(groupId?: number) {
    return useQuery<GroupMemberByGroup[]>({
        queryKey: ['groups', 'members', groupId],
        queryFn: async () => await GroupService.getMembersByGroupId(groupId),
        enabled: !!groupId,
    });
}

export function useCreateGroup() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { name: string; description?: string; groupMemberIds: string[] }) =>
            GroupService.createGroup(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
        },
    });
}

export function useUpdateGroup() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, updates }: { id: number, updates: Partial<Pick<Group, 'name' | 'description'>> }) =>
            GroupService.updateGroup(id, updates),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            queryClient.invalidateQueries({ queryKey: ['groups', variables.id] });
        },
    });
}

export function useAddMember() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ groupId, userId }: { groupId: number; userId: number }) =>
            GroupService.addMember(groupId, userId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            queryClient.invalidateQueries({ queryKey: ['groups', variables.groupId] });
        },
    });
}

export function useRemoveMember() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ groupId, userId }: { groupId: number; userId: number }) =>
            GroupService.removeMember(groupId, userId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            queryClient.invalidateQueries({ queryKey: ['groups', variables.groupId] });
        },
    });
}

export function useLeaveGroup() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ groupId, userId }: { groupId: number; userId: number }) =>
            GroupService.leaveGroup(groupId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
        },
    });
}

export function useDeleteGroup() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (groupId: number) => GroupService.deleteGroup(groupId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
        },
    });
}

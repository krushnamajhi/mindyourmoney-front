import apiClient from '../api/axiosClient';
import type { Group, GroupMemberByGroup, Groups } from '../domain/models';

export class GroupService {
    private static URL = "/expense-tracker/group"
    static async getGroups(): Promise<Groups[]> {
        const response = await apiClient.get(this.URL + '/list');
        return response.data
    }

    static async getGroupById(id: number): Promise<Group | undefined> {
        const response = await apiClient.get(this.URL + '/' + id);
        return response.data;
    }

    static async getMembersByGroupId(groupId?: number): Promise<GroupMemberByGroup[]> {
        const response = await apiClient.get(this.URL + '/' + groupId + '/members');
        return response.data;
    }

    static async createGroup(data: { name: string; description?: string; groupMemberIds: number[] }): Promise<Group> {
        return await apiClient.post(this.URL + '/create', data);
    }

    static async updateGroup(id: number, updates: Partial<Pick<Group, 'name' | 'description'>>): Promise<Group> {
        return await apiClient.put(this.URL + '/' + id, updates);
    }

    static async addMember(groupId: number, userId: number): Promise<Group> {
        return await apiClient.put(this.URL + '/add-member/' + groupId, { groupMemberIds: [userId] });
    }

    static async removeMember(groupId: number, userId?: number): Promise<Group> {
        return await apiClient.put(this.URL + '/remove-member/' + groupId, { groupMemberIds: [userId] });
    }

    static async leaveGroup(groupId: number, userId: number): Promise<void> {
        await this.removeMember(groupId, userId);
    }

    static async deleteGroup(groupId: number): Promise<void> {
        return await apiClient.delete(this.URL + '/' + groupId);
    }
}

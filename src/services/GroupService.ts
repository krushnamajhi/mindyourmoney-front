import apiClient from '../api/axiosClient';
import type { Group, Groups } from '../domain/models';

export class GroupService {
    private static URL = "/expense-tracker/group"
    static async getGroups(): Promise<Groups[]> {
        const response = await apiClient.get(this.URL + '/list');
        return response.data
    }

    static async getGroupById(id: string): Promise<Group | undefined> {
        const response = await apiClient.get(this.URL + '/' + id);
        return response.data;
    }

    static async createGroup(data: { name: string; description?: string; groupMemberIds: string[] }): Promise<Group> {
        return await apiClient.post(this.URL + '/create', data);
    }

    static async updateGroup(id: string, updates: Partial<Pick<Group, 'name' | 'description'>>): Promise<Group> {
        return await apiClient.put(this.URL + '/' + id, updates);
    }

    static async addMember(groupId: string, userId: string): Promise<Group> {
        return await apiClient.put(this.URL + '/add-member/' + groupId, { groupMemberIds: [userId] });
    }

    static async removeMember(groupId: string, userId: string): Promise<Group> {
        return await apiClient.put(this.URL + '/remove-member/' + groupId, { groupMemberIds: [userId] });
    }

    static async leaveGroup(groupId: string, userId: string): Promise<void> {
        await this.removeMember(groupId, userId);
    }

    static async deleteGroup(groupId: string): Promise<void> {
        return await apiClient.delete(this.URL + '/' + groupId);
    }
}

import apiClient from '../api/axiosClient';
import type { ExpenseCategoryModel } from '../domain/models';

export class ExpenseCategoryService {
    private static URL = "/expense-tracker/expense-category";

    // List all categories
    static async getCategories(): Promise<ExpenseCategoryModel[]> {
        const response = await apiClient.get(`${this.URL}/list`);
        return response.data;
    }

    // Get category by ID
    static async getCategoryById(id: string): Promise<ExpenseCategoryModel> {
        const response = await apiClient.get(`${this.URL}/${id}`);
        return response.data;
    }

    // Create a new category
    static async createCategory(data: { name: string; description?: string }): Promise<ExpenseCategoryModel> {
        const response = await apiClient.post(`${this.URL}/create`, data);
        return response.data;
    }

    // Update an existing category
    static async updateCategory(id: string, data: { name?: string; description?: string }): Promise<ExpenseCategoryModel> {
        const response = await apiClient.put(`${this.URL}/${id}`, data);
        return response.data;
    }

    // Delete a category
    static async deleteCategory(id: string): Promise<void> {
        await apiClient.delete(`${this.URL}/${id}`);
    }
}

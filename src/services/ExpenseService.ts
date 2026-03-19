import apiClient from '../api/axiosClient';
import type { CreateExpenseDto, Expense, ExpenseFilters, ExpenseRowYearMonthWise, SettleExpenseDto } from '../domain/models';

export class ExpenseService {

    private static URL = "/expense-tracker/expense"

    static async getExpenseEditability(id: string): Promise<{ editable: boolean; message?: string }> {
        const response = await apiClient.get(this.URL + '/' + id + '/editable');
        return response.data.data;
    }

    static async getExpenses(): Promise<Expense[]> {
        const response = await apiClient.get(this.URL + '/list');
        return response.data.expenses;
    }

    static async getExpensesByGroupId(groupId: string): Promise<Expense[]> {
        return this.filterExpenses({ isShared: [true], groupId: [Number(groupId)] });
    }

    static async getDebtAmountForLoggedInUserInExpense(expenseId: number): Promise<Number> {
        const response = await apiClient.get(this.URL + '/debtamount/id=' + expenseId.toString());
        return response.data;
    }

    static async filterExpenses(filters: ExpenseFilters): Promise<Expense[]> {
        console.log(filters);

        const response = await apiClient.post(this.URL + '/filter', filters);
        return response.data.data.expenses;
    }

    static async filterExpenseRows(filters: ExpenseFilters): Promise<ExpenseRowYearMonthWise[]> {
        const response = await apiClient.post(this.URL + '/filter', filters);
        return response.data.data.expenses;
    }

    static async createExpense(dto: any, groupMembers: string[]): Promise<Expense> {
        const response = await apiClient.post(this.URL + '/create', {
            ...dto,
            groupMembers
        });
        return response.data;
    }

    static async getExpenseById(id: string): Promise<Expense> {
        const response = await apiClient.get(this.URL + '/find/' + id);
        return response.data.expense;
    }

    static async getExpenseDetailsById(id: string): Promise<CreateExpenseDto> {
        const response = await apiClient.get(this.URL + '/' + id + '/details');
        return response.data.data;
    }

    static async updateExpense(id: string, dto: any, groupMembers: string[]): Promise<Expense> {
        const response = await apiClient.put(this.URL + '/' + id, {
            ...dto,
            groupMembers
        });
        return response.data;
    }

    static async deleteExpense(groupId: string): Promise<void> {
        return await apiClient.delete(this.URL + '/' + groupId);
    }

    static async settleExpense(dto: SettleExpenseDto): Promise<Expense> {
        const response = await apiClient.post(this.URL + '/settle', dto);
        return response.data;
    }

    static async updateSettledExpense(id: string, dto: SettleExpenseDto): Promise<Expense> {
        const response = await apiClient.put(this.URL + '/settle/' + id, dto);
        return response.data;
    }


    static async getSettledExpenseDetailsById(id: string): Promise<SettleExpenseDto> {
        const response = await apiClient.get(this.URL + '/settle/' + id);
        return response.data.data;
    }

    static async getAllSettleExpenses(): Promise<SettleExpenseDto[]> {
        const response = await apiClient.get(this.URL + '/settle/list');
        return response.data.data;
    }
}

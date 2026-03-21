import apiClient from '../api/axiosClient';
import type { CreateExpenseDto, Expense, ExpenseFilters, ExpenseFormDto, ExpenseRowYearMonthWise, SettleExpenseDto, UpdateExpenseDto } from '../domain/models';

export class ExpenseService {

    private static URL = "/expense-tracker/expense"
    static async getExpenseEditability(id: number): Promise<{ editable: boolean; message?: string }> {
        const response = await apiClient.get(this.URL + '/' + id + '/editable');
        return response.data.data
    }

    static async getExpenses(): Promise<Expense[]> {
        const response = await apiClient.get(this.URL + '/list');
        return response.data.expenses;
    }

    static async getExpensesByGroupId(groupId: number): Promise<Expense[]> {
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

    static async createExpense(dto: CreateExpenseDto): Promise<Expense> {
        const response = await apiClient.post(this.URL + '/create', dto);
        return response.data;
    }

    static async getExpenseById(id: number): Promise<Expense> {
        const response = await apiClient.get(this.URL + '/find/' + id);
        return response.data.expense;
    }

    static async getExpenseDetailsById(id: number): Promise<ExpenseFormDto> {
        const response = await apiClient.get(this.URL + '/' + id + '/details');
        return response.data.data;
    }

    static async updateExpense(id: number, dto: UpdateExpenseDto): Promise<Expense> {
        const response = await apiClient.put(this.URL + '/' + id, dto);
        return response.data;
    }

    static async deleteExpense(groupId: number): Promise<void> {
        return await apiClient.delete(this.URL + '/' + groupId);
    }

    static async settleExpense(dto: SettleExpenseDto): Promise<Expense> {
        const response = await apiClient.post(this.URL + '/settle', dto);
        return response.data;
    }

    static async updateSettledExpense(id: number, dto: SettleExpenseDto): Promise<Expense> {
        const response = await apiClient.put(this.URL + '/settle/' + id, dto);
        return response.data;
    }


    static async getSettledExpenseDetailsById(id?: number): Promise<SettleExpenseDto> {
        const response = await apiClient.get(this.URL + '/settle/' + id);
        return response.data.data;
    }

    static async getAllSettleExpenses(): Promise<SettleExpenseDto[]> {
        const response = await apiClient.get(this.URL + '/settle/list');
        return response.data.data;
    }
}

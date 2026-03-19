import { z } from 'zod';

// ============================================
// User Schema
// ============================================
export const UserSchema = z.object({
    id: z.string().uuid(),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email(),
    avatarUrl: z.string().url().optional(),
    fullName: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;

// ============================================
// Expense Category Model (Domain-Driven)
// ============================================
export const ExpenseCategoryModelSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, "Category name is required"),
    description: z.string().optional(),
    createdUserId: z.string().uuid().optional(),
    createdUser: UserSchema.optional(),
});
export type ExpenseCategoryModel = z.infer<typeof ExpenseCategoryModelSchema>;

// Legacy Expense Category Enum (for backward compatibility in forms)
export const ExpenseCategoryEnumSchema = z.enum(['Food & Drink', 'Groceries', 'Utilities', 'Transport', 'Housing', 'Entertainment', 'Health', 'Income', 'Other']);
export type ExpenseCategoryEnum = z.infer<typeof ExpenseCategoryEnumSchema>;

// ============================================
// Group Member Model
// ============================================
export const GroupMemberSchema = z.object({
    groupId: z.string().uuid(),
    userId: z.string().uuid(),
    user: UserSchema.optional(), // Optional nested user object
});

export type GroupMember = z.infer<typeof GroupMemberSchema>;

export interface GroupMemberByGroup {
    groupId: number;
    userId: number;
    isActive: boolean;
    user: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        fullName: string;
    };
}


// ============================================
// Group Schema (Updated)
// ============================================
export const GroupSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, "Group name is required"),
    description: z.string().optional(),
    groupMembers: z.array(GroupMemberSchema),
    created_at: z.string().datetime(),
});

export const GroupsSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, "Group name is required"),
    description: z.string().optional(),
    groupMembers: z.array(UserSchema),
    created_at: z.string().datetime(),
    balance: z.number().optional(),
});
export type Group = z.infer<typeof GroupSchema>;
export type Groups = z.infer<typeof GroupsSchema>;


// Legacy Group Schema (for backward compatibility during migration)
export const LegacyGroupSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, "Group name is required"),
    members: z.array(UserSchema),
    created_at: z.string().datetime(),
});
export type LegacyGroup = z.infer<typeof LegacyGroupSchema>;

// ============================================
// Split Type Enum
// ============================================
export const SplitTypeSchema = z.enum(['EQUAL', 'PERCENT', 'EXACT', 'SHARES', 'ITEMS']);
export const ExpenseItemLineSplitType = z.enum(['EQUAL', 'PERCENT', 'EXACT', 'SHARES', 'ITEMS']);

export type SplitType = z.infer<typeof SplitTypeSchema>;
export type ExpenseItemLineSplitType = z.infer<typeof ExpenseItemLineSplitType>;


// ============================================
// Split Definition (Input for strategy)
// ============================================
export const DebtMemberSplitsSchema = z.object({
    userId: z.string().uuid(),
    amount: z.number().min(0).optional(), // For EXACT/ITEMS
    percent: z.number().min(0).max(100).optional(), // For PERCENTAGE
    share: z.number().min(0).optional(), // For SHARES
});
export type DebtMemberSplits = z.infer<typeof DebtMemberSplitsSchema>;

export const DebtMemberSplitExpenseItemLineSchema = z.object({
    userId: z.string().uuid(),
    amount: z.number().min(0).optional(), // For EXACT/ITEMS
    percent: z.number().min(0).max(100).optional(), // For PERCENTAGE
    share: z.number().min(0).optional(), // For SHARES
});
export type DebtMemberSplitExpenseItemLine = z.infer<typeof DebtMemberSplitExpenseItemLineSchema>;

// ============================================
// Expense Line (The result stored in DB)
// ============================================
export const ExpenseItemLinesSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    splitType: ExpenseItemLineSplitType,
    isShared: z.boolean().default(true),
    amount: z.number(),
    debtMemberSplitsExpenseItemLines: z.array(DebtMemberSplitExpenseItemLineSchema).optional(),
});
export type ExpenseItemLine = z.infer<typeof ExpenseItemLinesSchema>;

// ============================================
// Expense Status
// ============================================
export const ExpenseStatusSchema = z.enum(['COMPLETED', 'PENDING', 'FAILED']);
export type ExpenseStatus = z.infer<typeof ExpenseStatusSchema>;

// ============================================
// Expense Schema (Updated with nested objects)
// ============================================
export const ExpenseSchema = z.object({
    id: z.string().uuid(),
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    amount: z.number().positive("Amount must be positive"),
    expenseDate: z.string().datetime(),
    date: z.string().datetime(), // Keep for backward compatibility
    isShared: z.boolean().default(true),
    group: GroupSchema,
    expenseCategory: ExpenseCategoryModelSchema,
    paidByUser: z.object({ userInfo: UserSchema }),
    splitType: SplitTypeSchema,
    status: ExpenseStatusSchema.default('COMPLETED'),
    debtMemberSplits: z.array(DebtMemberSplitsSchema).optional(),
    expenseItemLines: z.array(ExpenseItemLinesSchema).optional(),
    userDebt: z.number().default(0),
    isSettled: z.boolean().optional(),
});
export type Expense = z.infer<typeof ExpenseSchema>;

// ============================================
// Create Expense DTO
// ============================================
export const CreateExpenseSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    amount: z.number().positive("Amount must be positive"),
    expenseDate: z.string().datetime(),
    isShared: z.boolean().default(true),
    groupId: z.string().uuid(),
    expenseCategoryId: z.coerce.number().optional(),
    paidByUserId: z.string().uuid(),
    splitType: SplitTypeSchema,
    status: ExpenseStatusSchema.optional(),
    debtMemberSplits: z.array(DebtMemberSplitsSchema).optional(),
    expenseItemLines: z.array(ExpenseItemLinesSchema).optional()
});
export type CreateExpenseDto = z.infer<typeof CreateExpenseSchema>;

// ============================================
// Authentication Types
// ============================================
export const SignupDataSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});
export type SignupData = z.infer<typeof SignupDataSchema>;

export const LoginDataSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});
export type LoginData = z.infer<typeof LoginDataSchema>;

export const AuthResponseSchema = z.object({
    token: z.string(),
    user: UserSchema,
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

export const Filter_ALL = "ALL";
export const Filter_NONE = 'NONE';

export type MultiSelectFilter<T> = T[] | typeof Filter_ALL;

export const ExpenseFilterSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    amount: z.coerce.number().positive().optional(),
    isShared: z.array(z.coerce.boolean()).or(z.enum([Filter_ALL])).optional(),
    paidByUserId: z.array(z.coerce.number().or(z.enum([Filter_NONE]))).or(z.enum([Filter_ALL])).optional(),
    groupId: z.array(z.coerce.number().int().or(z.enum([Filter_NONE]))).or(z.enum([Filter_ALL])).optional(),
    expenseCategoryId: z.array(z.coerce.number().int().or(z.enum([Filter_NONE]))).or(z.enum([Filter_ALL])).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    limit: z.coerce.number().int().positive().optional(),
})

export type ExpenseFilters = z.infer<typeof ExpenseFilterSchema>;

// ============================================
// Settle Expense Schema
// ============================================
export const SettleExpenseDtoSchema = z.object({
    expenseId: z.coerce.number().int().optional(),
    amount: z.number().positive("Amount must be positive"),
    paidByUserId: z.coerce.number().int(),
    groupId: z.coerce.number().int().optional(),
    settledMemberId: z.coerce.number().int(),
});

export type SettleExpenseDto = z.infer<typeof SettleExpenseDtoSchema>;

// ============================================
// Expense Row Grouped Response ((Year + Month) -> Day)
// ============================================
export interface ExpenseRow {
    id: number;
    expenseDate: string | Date;
    title: string;
    description?: string;
    amount: number;
    paidByUser: {
        id: number;
        fullName: string;
    };
    paidToUser?: {
        id: number;
        fullName: string;
    };
    group?: {
        id: number;
        name: string;
    };
    expenseCategory?: {
        id: number;
        name: string;
    };
    isShared?: boolean;
    isSettled?: boolean;
    balance: number;
}

export interface ExpenseRowDayWise {
    day: number;
    expensesPerDay: ExpenseRow[];
}

export interface ExpenseRowYearMonthWise {
    year: number;
    month: string;
    expensesPerMonth: ExpenseRowDayWise[];
}

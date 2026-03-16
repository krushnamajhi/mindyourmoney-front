import type { DebtMemberSplitExpenseItemLine, DebtMemberSplits } from '../models';

export interface SplitResult {
    userId: string;
    amount: number;
}

export interface SplitStrategy {
    calculateSplits(totalAmount: number, members: string[], definitions: DebtMemberSplits[] | DebtMemberSplitExpenseItemLine[]): SplitResult[];
    validate(totalAmount: number, definitions: DebtMemberSplits[]): void;
}

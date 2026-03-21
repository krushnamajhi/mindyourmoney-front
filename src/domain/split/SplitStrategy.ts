import type { DebtMemberSplitExpenseItemLine, DebtMemberSplits } from '../models';

export interface SplitResult {
    userId: number;
    amount: number;
}

export interface SplitStrategy {
    calculateSplits(totalAmount: number, members: number[], definitions: DebtMemberSplits[] | DebtMemberSplitExpenseItemLine[]): SplitResult[];
    validate(totalAmount: number, definitions: DebtMemberSplits[]): void;
}

import type { DebtMemberSplitExpenseItemLine, DebtMemberSplits } from '../models';
import type { SplitStrategy, SplitResult } from './SplitStrategy';

export class EqualSplitStrategy implements SplitStrategy {
    calculateSplits(totalAmount: number, members: string[], _definitions: DebtMemberSplits[] | DebtMemberSplitExpenseItemLine[]): SplitResult[] {
        console.log("members", members)
        if (members.length === 0) return [];

        const count = members.length;
        // Calculate simple split
        const splitAmount = Math.floor((totalAmount / count) * 100) / 100;

        // Calculate remainder to distribute
        const remainder = Math.round((totalAmount - (splitAmount * count)) * 100);

        return members.map((memberId, index) => ({
            userId: memberId,
            amount: index < remainder ? Number((splitAmount + 0.01).toFixed(2)) : splitAmount
        }));
    }

    validate(_totalAmount: number, _definitions: DebtMemberSplits[]): void {
        // No specific validation needed for equal split input
    }
}

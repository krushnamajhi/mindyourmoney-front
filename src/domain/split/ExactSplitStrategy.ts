import type { DebtMemberSplitExpenseItemLine, DebtMemberSplits } from '../models';
import type { SplitStrategy, SplitResult } from './SplitStrategy';

export class ExactSplitStrategy implements SplitStrategy {
    calculateSplits(_totalAmount: number, _members: string[], definitions: DebtMemberSplits[] | DebtMemberSplitExpenseItemLine[]): SplitResult[] {
        return definitions.map(def => ({
            userId: def.userId,
            amount: def.amount || 0
        }));
    }

    validate(totalAmount: number, definitions: DebtMemberSplits[]): void {
        const sum = definitions.reduce((acc, def) => acc + (def.amount || 0), 0);
        if (Math.abs(sum - totalAmount) > 0.01) {
            throw new Error(`Total split amount ${sum} does not match expense amount ${totalAmount}`);
        }
    }
}

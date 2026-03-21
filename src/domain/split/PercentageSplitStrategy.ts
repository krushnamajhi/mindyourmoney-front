import type { DebtMemberSplitExpenseItemLine, DebtMemberSplits } from '../models';
import type { SplitStrategy, SplitResult } from './SplitStrategy';

export class PercentageSplitStrategy implements SplitStrategy {
    calculateSplits(totalAmount: number, _members: Array<string | number>, definitions: DebtMemberSplits[] | DebtMemberSplitExpenseItemLine[]): SplitResult[] {
        // Sort to handle remainder distribution logic if needed, but for now simple calc
        const results = definitions.map(def => {
            const percentage = def.percent || 0;
            const amount = (totalAmount * percentage) / 100;
            return {
                userId: def.userId,
                amount: Math.floor(amount * 100) / 100 // Floor to 2 decimals
            };
        });

        // Fix rounding errors by adding to the first person (or random)
        const currentSum = results.reduce((acc, res) => acc + res.amount, 0);
        const diff = Number((totalAmount - currentSum).toFixed(2));

        if (diff !== 0 && results.length > 0) {
            results[0].amount = Number((results[0].amount + diff).toFixed(2));
        }

        return results;
    }

    validate(_totalAmount: number, definitions: DebtMemberSplits[]): void {
        const totalPercentage = definitions.reduce((acc, def) => acc + (def.percent || 0), 0);
        if (Math.abs(totalPercentage - 100) > 0.01) {
            throw new Error(`Total percentage ${totalPercentage} must equal 100%`);
        }
    }
}

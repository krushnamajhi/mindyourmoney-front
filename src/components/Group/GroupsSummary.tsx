import { Users } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'
import type { Groups } from '../../domain/models';

export default function GroupsSummary({ groups }: { groups: Groups[] | undefined }) {
    const { formatCurrency } = useSettings();
    let totalYouAreOwed = 0;
    let totalYouOwe = 0;
    groups?.forEach(group => {
        group.balance = group.balance || 0;
        if (group.balance < 0) {
            totalYouOwe += group.balance;
        } else {
            totalYouAreOwed += group.balance;
        }
    })
    return (
        <div className="glass-morphism rounded-xl p-6 flex items-center justify-between grid grid-cols-1 sm:grid-cols-2 gap-2 transition-all hover:shadow-2xl">
            <div className="flex items-center space-x-4">
                <div className="bg-primary-100 p-3 rounded-full text-primary-600">
                    <Users size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Groups Summary</h3>
                    <p className="text-sm text-slate-500">Aggregate balance across all active groups</p>
                </div>
            </div>

            <div className="flex items-center space-x-4 sm:space-x-8 justify-end">
                <div>
                    <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">You Owe</p>
                    <p className="font-bold text-red-600 text-right text-lg sm:text-xl md:text-2xl">{formatCurrency(Math.abs(totalYouOwe))}</p>
                </div>
                <div className="h-8 sm:h-10 w-px bg-slate-200"></div>
                <div>
                    <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">You're Owed</p>
                    <p className="font-bold text-green-600 text-right text-lg sm:text-xl md:text-2xl">{formatCurrency(Math.abs(totalYouAreOwed))}</p>
                </div>
            </div>
        </div>
    )
}
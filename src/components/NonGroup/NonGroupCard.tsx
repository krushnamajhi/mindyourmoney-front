import { Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Group } from '../../domain/models';
import { useSettings } from '../../context/SettingsContext';
import { BaseCard } from '../UI/BaseCard';

export const NonGroupCard = ({ group }: { group: Group }) => {
    const members = group.groupMembers.map(gm => gm.user).filter(Boolean);
    const { formatCurrency } = useSettings();

    return (
        <BaseCard headerIcon={<Users size={24} />}>
            <div className="mb-2">
                <h3 className="text-lg font-bold text-slate-900">{group.name}</h3>
                <p className="text-xs text-slate-500">{group.groupMembers.length} members</p>
            </div>

            {/* Member Avatars */}
            <div className="flex -space-x-2 mb-6">
                {members.slice(0, 3).map((m) => (
                    <div key={m!.id} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600" title={m!.fullName}>
                        {m!.avatarUrl ? <img src={m!.avatarUrl} alt={m!.firstName} className="w-full h-full rounded-full" /> : m!.firstName.charAt(0)}
                    </div>
                ))}
                {members.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-medium text-slate-500">
                        +{members.length - 3}
                    </div>
                )}
            </div>

            <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                    <p className="text-xs text-slate-500">Your balance</p>
                    <p className="text-sm font-bold text-red-600">You owe {formatCurrency(120.50)}</p>
                </div>
                <div className="flex space-x-2">
                    <button className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
                        Settle Up
                    </button>
                    <Link to={`/groups/${group.id}`} className="px-3 py-1.5 text-sm font-medium text-white bg-primary-900 hover:bg-primary-800 rounded-lg transition-colors">
                        View Details
                    </Link>
                </div>
            </div>
        </BaseCard>
    );
};

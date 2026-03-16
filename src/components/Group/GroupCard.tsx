import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { type Groups } from '../../domain/models';
import { useSettings } from '../../context/SettingsContext';
import { BaseCard } from '../UI/BaseCard';
import { useDeleteGroup } from '../../hooks/useGroups';
import { useFormErrorsUI } from '../../hooks/UI/useFormErrorsUI';
import MenuContainer from '../Containers/Menu/MenuContainer';
import SettingsMenuOption from '../UI/Menu/MenuOptions/SettingsMenuOption';
import DeleteMenuOption from '../UI/Menu/MenuOptions/DeleteMenuOption';
import { Button } from '../UI/Button';

interface GroupCardProps {
    group: Groups;
}

export const GroupCard = ({
    group,
}: GroupCardProps) => {
    const members = group.groupMembers.filter(Boolean);
    const { formatCurrency } = useSettings();
    const navigate = useNavigate();
    const deleteGroup = useDeleteGroup();
    const balance = group.balance || 0;
    const { setFormErrors, renderError } = useFormErrorsUI();

    const handleDeleteGroup = async () => {
        try {
            await deleteGroup.mutateAsync(group.id);
            navigate('/groups');
        } catch (err: any) {
            setFormErrors(err?.error as [], err?.errorType);
            console.error('Failed to delete group:', err);
        }
    };

    const renderBalance = () => {
        if (balance === 0) {
            return <p className="text-sm font-bold text-green-600">You are all settled up</p>;
        }
        if (balance > 0) {
            return <p className="text-sm font-bold text-green-600">You are owed {formatCurrency(balance)}</p>;
        }
        return <p className="text-sm font-bold text-red-600">You owe {formatCurrency(Math.abs(balance))}</p>;
    }

    const renderMenu = () => {
        return (<MenuContainer id={group.id} compact={true} size={'medium'}>
            <SettingsMenuOption onClick={() => navigate(`/groups/${group.id}/settings`)} />
            <DeleteMenuOption onClick={handleDeleteGroup} />
        </MenuContainer>)
    }

    return (
        <BaseCard
            headerIcon={<Users size={24} />}
            actions={renderMenu()}
        >
            {renderError()}
            <div className="mb-1">
                <h3 className="text-lg font-bold text-slate-900">{group.name}</h3>
                <p className="text-xs text-slate-500">{group.groupMembers.length} members</p>
            </div>

            {/* Member Avatars */}
            <div className="flex -space-x-2 mb-2">
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
                    {renderBalance()}
                </div>
                <div className="flex space-x-2">
                    <Button size='sm' color={balance === 0 ? 'disabledprimaryNoBackground' : 'primaryNoBackground'}
                        disabled={balance === 0}
                        onClick={() =>
                            navigate(`/expenses/settle/new?${"groupId"}=${group.id}&${"amount"}=${Math.abs(balance)}`)}>
                        {balance === 0 ? "Settled" : "Settle Up"}
                    </Button>
                    <Button onClick={() => navigate(`/groups/${group.id}`)} size='sm' color='primary'>
                        View Details
                    </Button>
                </div>
            </div>
        </BaseCard>
    );
};

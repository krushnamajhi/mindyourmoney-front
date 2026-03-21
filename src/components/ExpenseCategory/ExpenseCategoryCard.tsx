import { Tag } from 'lucide-react';
import type { ExpenseCategoryModel } from '../../domain/models';
import { useAuth } from '../../context/AuthContext';
import { BaseCard } from '../UI/BaseCard';
import MenuContainer from '../Containers/Menu/MenuContainer';
import SettingsMenuOption from '../UI/Menu/MenuOptions/SettingsMenuOption';
import DeleteMenuOption from '../UI/Menu/MenuOptions/DeleteMenuOption';

interface ExpenseCategoryCardProps {
    category: ExpenseCategoryModel;
    onView: (category: ExpenseCategoryModel) => void;
    onEdit: (category: ExpenseCategoryModel) => void;
    onDelete: (id: number) => void;
}

export function ExpenseCategoryCard({ category, onView, onEdit, onDelete }: ExpenseCategoryCardProps) {

    const { user } = useAuth();

    const renderMenu = () => {
        return (user?.id == category.createdUserId && <MenuContainer id={category.id} compact={true} size={'small'}>
            <SettingsMenuOption onClick={(e) => {
                e.stopPropagation();
                onEdit(category);
            }} />
            <DeleteMenuOption onClick={(e) => {
                e.stopPropagation();
                onDelete(category.id);
            }} />
        </MenuContainer>)
    }

    return (<BaseCard headerIcon={<Tag size={20} />} actions={renderMenu()} onClick={() => onView(category)}>
        <h3 className="text-base font-bold text-slate-900 mb-1 truncate">{category.name}</h3>
        <p className="text-xs text-slate-500 line-clamp-2 h-8">
            {category.description || 'No description provided.'}
        </p>
    </BaseCard>)
}

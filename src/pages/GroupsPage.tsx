import { Plus } from 'lucide-react';
import { MainLayout } from '../components/Layout/MainLayout';
import { useGroups } from '../hooks/useGroups';
import type { Groups } from '../domain/models';
import { GroupForm } from '../components/Group/GroupForm';
import { Loader } from '../components/UI/Loader';
import { ErrorDisplay } from '../components/UI/ErrorDisplay';
import { GroupCard } from '../components/Group/GroupCard';
import GroupsSummary from '../components/Group/GroupsSummary';
import { Button } from '../components/UI/Button';
import { HeaderLayout } from '../components/Layout/HeaderLayout';
import { HeaderSearchInput } from '../components/UI/HeaderSearchInput';
import { useAppDispatch } from '../store/hooks';
import { openModal } from '../store/modalSlice';

export function GroupsPage() {
    const { data: groups, isLoading, error } = useGroups();
    const dispatch = useAppDispatch();

    const handleOpenCreateGroup = () => {
        dispatch(openModal({
            modalType: 'form',
            modalId: 'group',
            data: {
                title: 'Create New Group',
                icon: 'Users',
                description: 'Add members to start tracking expenses',
                submitLabel: 'Create Group',
            }
        }));
    };

    return (
        <MainLayout>
            <div className="space-y-6 relative">
                <GroupForm />

                <HeaderLayout title="Groups" description="Manage shared expenses with friends." size="md">
                    <HeaderSearchInput placeholder="Search groups..." />
                    <Button
                        onClick={handleOpenCreateGroup}
                        icon={<Plus size={20} />}
                    >
                        New Group
                    </Button>
                </HeaderLayout>
                <GroupsSummary groups={groups} />
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader size="lg" text="Loading groups..." />
                    </div>
                ) : error ? (
                    <ErrorDisplay message="Failed to load groups." />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {groups?.map((group: Groups) => (
                            <div key={group.id}>
                                <GroupCard group={group} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}

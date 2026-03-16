// import { Plus } from 'lucide-react';
// import { MainLayout } from '../components/Layout/MainLayout';
// import { useGroups } from '../hooks/useGroups';
// import type { Group } from '../domain/models';
// import { GroupForm } from '../components/Group/GroupForm';
// import { Loader } from '../components/UI/Loader';
// import { ErrorDisplay } from '../components/UI/ErrorDisplay';
// import { useGroupsUI } from '../hooks/UI/useGroupsUI';
// import GroupsSummary from '../components/Group/GroupsSummary';
// import { Button } from '../components/UI/Button';
// import { HeaderLayout } from '../components/Layout/HeaderLayout';
// import { GroupCard } from '../components/Group/GroupCard';

// export function NonGroupsPage() {
//     const { data: groups, isLoading, error } = useGroups();
//     const { isFormOpen, setIsFormOpen, handleCreate, handleSuccess } = useGroupsUI();

//     return (
//         <MainLayout>
//             <div className="space-y-6 relative">
//                 {isFormOpen && (
//                     <GroupForm
//                         onSuccess={handleSuccess}
//                         onCancel={() => setIsFormOpen(false)}
//                     />
//                 )}

//                 <HeaderLayout title="Shared Expenses" description="Manage shared expenses with friends and roommates." size="md">
//                     <Button
//                         onClick={handleCreate}
//                         icon={<Plus size={20} />}
//                     >
//                         New Expense
//                     </Button>
//                 </HeaderLayout>
//                 <GroupsSummary />
//                 {isLoading ? (
//                     <div className="flex justify-center py-12">
//                         <Loader size="lg" text="Loading groups..." />
//                     </div>
//                 ) : error ? (
//                     <ErrorDisplay message="Failed to load groups." />
//                 ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {groups?.map((group: Group) => (
//                             <GroupCard key={group.id} group={group} />
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </MainLayout>
//     );
// }

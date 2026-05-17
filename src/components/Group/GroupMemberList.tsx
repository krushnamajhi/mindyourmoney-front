import { useMemo } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { useSearchUser } from '../../hooks/useUsers';
import type { User } from '../../domain/models';
import { useAuth } from '../../context/AuthContext';
import { GroupMember } from './GroupMember';
import { Loader } from '../UI/Loader';

export default function GroupMemberList({
    searchQuery,
    currentUserSelect = false,
    setSelectedMember,
    selectedMembers,
    pool
}: {
    searchQuery: string,
    currentUserSelect: boolean,
    setSelectedMember: Dispatch<SetStateAction<User[]>>,
    selectedMembers: User[],
    pool?: User[]
}) {

    const { user: currentUser } = useAuth();
    const { data: searchedResults, isLoading: searchedUserLoading } = useSearchUser(!pool ? searchQuery : '');

    const showMembers = useMemo(() => {
        let results: User[] = [];

        if (pool) {
            // Local filter from pool
            const q = searchQuery.toLowerCase().trim();
            results = q ? pool.filter(u =>
                u.firstName?.toLowerCase().includes(q) ||
                u.lastName?.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q) ||
                u.fullName?.toLowerCase().includes(q)
            ) : pool;
        } else {
            // Remote results
            results = searchedResults || [];
        }

        // Only include results if they aren't already selected
        const availableUsers = results.filter((user) =>
            !selectedMembers.some((sM) => sM.id === user.id)
        );

        // We always want to see selected members at the top or bottom
        return [...selectedMembers, ...availableUsers];
    }, [pool, searchQuery, searchedResults, selectedMembers]);

    const toggleMember = (user: User) => {
        const selectedUser = selectedMembers.find((su) => user.id === su.id)
        if (selectedUser) {
            if (currentUserSelect && currentUser && selectedUser.id === currentUser.id) return;
            setSelectedMember(prev => prev.filter(u => u.id !== user.id));
        } else {
            setSelectedMember(prev => [...prev, user]);
        }
    };

    const isSearching = searchQuery.length >= 2;

    return (
        <div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shadow-inner">
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-100/50 custom-scrollbar">
                    {/* If searching and loading, show a small loader at top or bottom, but don't hide selected members */}
                    {searchedUserLoading && (
                        <div className="p-2 border-b border-slate-100 bg-white/50 sticky top-0 z-10">
                            <Loader text={"Searching..."} size='sm' />
                        </div>
                    )}

                    {/* Show "No users found" only if search is active, not loading, and results are truly empty (availableUsers list is empty) */}
                    {isSearching && !searchedUserLoading && searchedResults?.length === 0 && (
                        <div className="p-4 text-center bg-white">
                            <p className="text-xs text-slate-400 font-medium italic">No new users found for "{searchQuery}"</p>
                        </div>
                    )}

                    {/* Always render the members we have (selected + search results) */}
                    {showMembers.length > 0 ? (
                        showMembers.map(user => {
                            const isSelected = selectedMembers.some((su) => user.id === su.id);
                            return <GroupMember key={`member-${user.id}`} user={user} isSelected={isSelected} toggleMember={toggleMember} />
                        })
                    ) : !searchedUserLoading && (
                        <div className="p-8 text-center">
                            <p className="text-sm text-slate-400 font-medium">
                                {isSearching ? `No users found matching "${searchQuery}"` : "Search to add members"}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

import { useState, useMemo } from 'react';
import { X, Search, Check } from 'lucide-react';
import { useUsers } from '../../hooks/useUsers';
import type { User } from '../../domain/models';

interface MemberSelectionModalProps {
    initialSelectedIds: number[];
    onSave: (selectedIds: number[]) => void;
    onCancel: () => void;
    filterGroupMembers?: User[]; // If provided, only show these users
}

export function MemberSelectionModal({ initialSelectedIds, onSave, onCancel, filterGroupMembers }: MemberSelectionModalProps) {
    const { data: allUsers } = useUsers();
    const [selectedIds, setSelectedIds] = useState<number[]>(initialSelectedIds);
    const [searchQuery, setSearchQuery] = useState('');

    const usersToDisplay = useMemo(() => {
        const sourceUsers = filterGroupMembers || allUsers || [];
        if (!searchQuery) return sourceUsers;
        return sourceUsers.filter(u =>
            u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [allUsers, filterGroupMembers, searchQuery]);

    const toggleUser = (userId: number) => {
        if (selectedIds.includes(userId)) {
            setSelectedIds(prev => prev.filter(id => id !== userId));
        } else {
            setSelectedIds(prev => [...prev, userId]);
        }
    };

    const handleSave = () => {
        onSave(selectedIds);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <h2 className="text-lg font-bold text-slate-900">Select People</h2>
                    <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 border-b border-slate-100">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search people..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                            autoFocus
                        />
                        <div className="absolute left-3 top-2.5 text-slate-400">
                            <Search size={16} />
                        </div>
                    </div>
                </div>

                <div className="p-2 overflow-y-auto flex-1">
                    <div className="space-y-1">
                        {usersToDisplay.map(user => {
                            const userId = user.id;
                            const isSelected = selectedIds.includes(userId);
                            return (
                                <button
                                    key={user.id}
                                    onClick={() => toggleUser(userId)}
                                    className={`w-full flex items-center p-3 rounded-lg transition-colors ${isSelected ? 'bg-primary-50' : 'hover:bg-slate-50'}`}
                                >
                                    <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center transition-colors ${isSelected ? 'bg-primary-600 border-primary-600 text-white' : 'border-slate-300 bg-white'}`}>
                                        {isSelected && <Check size={14} />}
                                    </div>

                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 mr-3">
                                        {user.avatarUrl ? <img src={user.avatarUrl} alt={user.firstName} className="rounded-full" /> : user.firstName.charAt(0)}
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className={`text-sm font-medium ${isSelected ? 'text-primary-900' : 'text-slate-900'}`}>{user.firstName}</p>
                                        <p className="text-xs text-slate-500">{user.email}</p>
                                    </div>
                                </button>
                            );
                        })}
                        {usersToDisplay.length === 0 && (
                            <div className="p-4 text-center text-slate-500 text-sm">
                                No users found.
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-slate-700 font-medium hover:bg-white hover:shadow-sm rounded-lg border border-transparent hover:border-slate-200 transition-all"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-primary-900 text-white font-medium rounded-lg hover:bg-primary-800 transition-colors shadow-sm"
                    >
                        Save Selection ({selectedIds.length})
                    </button>
                </div>
            </div>
        </div>
    );
}

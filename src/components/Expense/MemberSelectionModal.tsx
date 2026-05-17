import { createPortal } from 'react-dom';
import { X, Check, Users } from 'lucide-react';
import type { User } from '../../domain/models';
import SearchInput from '../UI/SearchInput';
import GroupMemberList from '../Group/GroupMemberList';
import type { Dispatch, SetStateAction } from 'react';

interface MemberSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    currentSelectedUsers: User[];
    handleSetSelectedMember: Dispatch<SetStateAction<User[]>>;
    pool?: User[];
    title?: string;
}

export function MemberSelectionModal({
    isOpen,
    onClose,
    searchQuery,
    setSearchQuery,
    currentSelectedUsers,
    handleSetSelectedMember,
    pool,
    title = "Select Members"
}: MemberSelectionModalProps) {
    if (!isOpen) return null;

    return createPortal(
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div 
                className="w-full max-w-xl bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-2xl">
                            <Users size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">{title}</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                                {currentSelectedUsers.length} People selected
                            </p>
                        </div>
                    </div>
                    <button 
                        type="button"
                        onClick={onClose} 
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-xl transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar space-y-6 flex-1">
                    <div className="space-y-4">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] px-1">
                            Search & Add
                        </label>
                        <SearchInput 
                            setDebouncedValue={setSearchQuery} 
                            placeholder='Search users by name or email...' 
                        />
                        <div className="mt-4">
                            <GroupMemberList
                                searchQuery={searchQuery}
                                currentUserSelect={false}
                                setSelectedMember={handleSetSelectedMember}
                                selectedMembers={currentSelectedUsers}
                                pool={pool}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t border-slate-100 bg-white">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full py-4 bg-primary-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-primary-500/20 hover:bg-primary-800 transition-all flex items-center justify-center space-x-2"
                    >
                        <Check size={18} strokeWidth={3} />
                        <span>Done Selecting</span>
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

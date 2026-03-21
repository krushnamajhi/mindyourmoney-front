import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useCreateGroup } from '../../hooks/useGroups';
import { useUsers } from '../../hooks/useUsers';
import { GroupMember } from './GroupMember';
import { useAuth } from '../../context/AuthContext';
import ModalContainer from '../Containers/Modal/ModalContainer';
import { useAppDispatch } from '../../store/hooks';
import { closeModal } from '../../store/modalSlice';
import { useFormErrorsUI } from '../../hooks/UI/useFormErrorsUI';
import FormInput from '../UI/Form/FormInput';
import FormInputTextArea from '../UI/Form/FormInputTextArea';

export function GroupForm() {
    const [name, setName] = useState('');
    const { user: currentUser } = useAuth();
    const [description, setDescription] = useState('');
    const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { setFormErrors, renderError } = useFormErrorsUI();

    const { data: allUsers, isLoading } = useUsers();
    const createGroup = useCreateGroup();
    const dispatch = useAppDispatch();
    // dispatch(setPending(createGroup.isPending))

    useEffect(() => {
        if (currentUser) {
            if (selectedMemberIds.length === 0) {
                setSelectedMemberIds([String(currentUser.id)]);
            }
        }
    }, [])

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        try {
            await createGroup.mutateAsync({
                name,
                description: description || undefined,
                groupMemberIds: selectedMemberIds,
            });
            dispatch(closeModal());
        } catch (error: any) {
            setFormErrors(error);
        }
    };

    const toggleMember = (userId: string | number) => {
        const normalizedUserId = String(userId);
        if (selectedMemberIds.includes(normalizedUserId)) {
            if (currentUser && normalizedUserId === String(currentUser.id)) return;
            setSelectedMemberIds(prev => prev.filter(id => id !== normalizedUserId));
        } else {
            setSelectedMemberIds(prev => [...prev, normalizedUserId]);
        }
    };

    const filteredUsers = allUsers?.filter(user =>
        user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];


    const renderModal = () => {
        return (
            <ModalContainer>
                <form id="modal-form-group" onSubmit={handleSubmit} className="space-y-4">
                    {renderError()}

                    <FormInput data={
                        {
                            label: "Group Name",
                            value: name,
                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value),
                            placeholder: "e.g., Summer Trip, Apartment 302",
                            autoFocus: true,
                            viewMode: false
                        }} />

                    <FormInputTextArea data={{
                        label: "Description (Optional)",
                        value: description,
                        onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value),
                        placeholder: "What's this group for?",
                        autoFocus: true,
                        viewMode: false
                    }} />

                    <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Select Members</label>
                            <span className="text-[10px] font-bold text-primary-700 bg-primary-100/50 px-2 py-0.5 rounded-full">
                                {selectedMemberIds.length} SELECTED
                            </span>
                        </div>

                        <div className="relative group/search">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-primary-600 transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Search users by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500/30 transition-all shadow-inner"
                            />
                        </div>

                        <div className="bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden shadow-inner">
                            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100/50 custom-scrollbar">
                                {isLoading ? (
                                    <div className="p-8 text-center">
                                        <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-2" />
                                        <p className="text-xs text-slate-500 font-medium">Loading potential members...</p>
                                    </div>
                                ) : filteredUsers.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <p className="text-sm text-slate-400 font-medium">No users found matching "{searchQuery}"</p>
                                    </div>
                                ) : (
                                    filteredUsers.map(user => {
                                        const isSelected = selectedMemberIds.includes(String(user.id));
                                        return <GroupMember key={user.id} user={user} isSelected={isSelected} toggleMember={toggleMember} />
                                    })
                                )}
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium px-1 flex items-center italic">
                            * Scroll to see more users and click to select members for this group.
                        </p>
                    </div>
                </form>
            </ModalContainer>
        )
    }

    return renderModal()
}

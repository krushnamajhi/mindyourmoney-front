import { useForm } from "react-hook-form";
import ModalContainer from "../Containers/Modal/ModalContainer";
import FormSelect from "../UI/Form/FormSelect";
import SearchInput from "../UI/SearchInput";
import { useEffect, useState } from "react";
import GroupMemberList from "../Group/GroupMemberList";
import { useGroupMembersByGroup, useGroups } from "../../hooks/useGroups";
import type { User } from "../../domain/models";
import { useAuth } from "../../context/AuthContext";
import { useAppDispatch } from "../../store/hooks";
import { closeModal } from "../../store/modalSlice";

export function SelectGroupInExpenseModal({
    setAvailableMembers,
    setSelectedGroupId,
}: {
    setAvailableMembers: (members: User[]) => void;
    setSelectedGroupId: (groupId: number | undefined) => void;
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const { data: groups } = useGroups();
    const { user: currentUser } = useAuth();
    const [selectedMember, setSelectedMember] = useState<User[]>(currentUser ? [currentUser] : []);

    const {
        control,
        watch,
        handleSubmit,
    } = useForm({
        defaultValues: { groupId: '' },
    });
    const dispatch = useAppDispatch();


    const selectedGroupId = watch('groupId');

    // Fetch group members reactively based on selected group
    const { data: groupMembers } = useGroupMembersByGroup(
        selectedGroupId ? Number(selectedGroupId) : undefined
    );

    // Update selected members when group members change
    useEffect(() => {
        if (selectedGroupId && groupMembers) {
            setSelectedMember(groupMembers.map(m => m.user));
        } else if (!selectedGroupId) {
            setSelectedMember(currentUser ? [currentUser] : []);
        }
    }, [selectedGroupId, groupMembers, currentUser]);

    console.log("selectedMembers", selectedMember);
    const submit = () => {
        setAvailableMembers(selectedMember);
        setSelectedGroupId(selectedGroupId ? Number(selectedGroupId) : undefined);
        dispatch(closeModal());
    }

    return (
        <ModalContainer>
            <form
                id="modal-form-selectGroupInExpense"
                onSubmit={handleSubmit(submit)}>
                <FormSelect
                    data={{
                        label: 'Group (Optional)',
                        name: 'groupId',
                        control,
                        viewMode: false,
                        options: [
                            { label: '👥 No Group (Individual Split)', value: '' },
                            ...(groups?.map(g => ({ label: `🏠 ${g.name}`, value: String(g.id) })) || [])
                        ],
                        placeholder: 'Select Group',
                    }}
                />
                {!selectedGroupId && (
                    <>
                        <SearchInput setDebouncedValue={setSearchQuery} placeholder='Enter name or Email' />
                        <GroupMemberList
                            searchQuery={searchQuery}
                            currentUserSelect={false}
                            setSelectedMember={setSelectedMember}
                            selectedMembers={selectedMember}
                        />
                    </>
                )}
            </form>
        </ModalContainer>
    );
}
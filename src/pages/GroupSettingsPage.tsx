import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/Layout/MainLayout';
import { useGroup, useUpdateGroup, useAddMember, useRemoveMember, useLeaveGroup, useDeleteGroup } from '../hooks/useGroups';
import { useUsers } from '../hooks/useUsers';
import { ArrowLeft, Edit2, Check, X, UserPlus, LogOut, Trash2 } from 'lucide-react';
import { Loader } from '../components/UI/Loader';
import { ErrorDisplay } from '../components/UI/ErrorDisplay';

import { useAuth } from '../context/AuthContext';
import { useFormErrorsUI } from '../hooks/UI/useFormErrorsUI';

export function GroupSettingsPage() {
    const { user: currentUser } = useAuth();
    const { groupId } = useParams<{ groupId: string }>();
    const navigate = useNavigate();
    const { data: group, isLoading, error } = useGroup(groupId!);
    const { data: allUsers } = useUsers();
    const { setFormErrors, renderError } = useFormErrorsUI();

    const updateGroup = useUpdateGroup();
    const addMember = useAddMember();
    const removeMember = useRemoveMember();
    const leaveGroup = useLeaveGroup();
    const deleteGroup = useDeleteGroup();

    const [isEditingName, setIsEditingName] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [editedDescription, setEditedDescription] = useState('');
    const [isAddingMember, setIsAddingMember] = useState(false);
    const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    if (isLoading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-full">
                    <Loader size="lg" text="Loading group settings..." />
                </div>
            </MainLayout>
        );
    }

    if (error || !group) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-full">
                    <ErrorDisplay
                        message={error ? "Failed to load group." : "Group not found."}
                        onRetry={() => navigate('/groups')}
                    />
                </div>
            </MainLayout>
        );
    }

    const members = group.groupMembers.map(gm => gm.user).filter(Boolean);
    const currentUserId = currentUser?.id || '';

    const handleSaveName = async () => {
        if (!editedName.trim()) return;
        try {
            await updateGroup.mutateAsync({ id: group.id, updates: { name: editedName } });
            setIsEditingName(false);
        } catch (err) {
            console.error('Failed to update name:', err);
        }
    };

    const handleSaveDescription = async () => {
        try {
            await updateGroup.mutateAsync({ id: group.id, updates: { description: editedDescription || undefined } });
            setIsEditingDescription(false);
        } catch (err) {
            console.error('Failed to update description:', err);
        }
    };

    const handleAddMember = async (userId: string) => {
        try {
            await addMember.mutateAsync({ groupId: group.id, userId });
            setIsAddingMember(false);
        } catch (err) {
            console.error('Failed to add member:', err);
        }
    };

    const handleRemoveMember = async (userId: string) => {
        try {
            await removeMember.mutateAsync({ groupId: group.id, userId });
        } catch (err: any) {
            setFormErrors(err?.error as [], err?.errorType);
            console.error('Failed to remove member:', err);
        }
    };

    const handleLeaveGroup = async () => {
        try {
            await leaveGroup.mutateAsync({ groupId: group.id, userId: currentUserId });
        } catch (err: any) {
            setShowLeaveConfirm(false);
            setFormErrors(err?.error as [], err?.errorType);
            console.error('Failed to leave group:', err);
        }
    };

    const handleDeleteGroup = async () => {
        try {
            await deleteGroup.mutateAsync(group.id);
            navigate('/groups');
        } catch (err: any) {
            setFormErrors(err?.error as [], err?.errorType);
            console.error('Failed to delete group:', err);
        }
    };

    const availableUsers = allUsers?.filter(
        u => !group.groupMembers.some(gm => gm.userId === u.id)
    ) || [];

    return (
        <MainLayout>
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate(`/groups/${group.id}`)}
                        className="p-2 -ml-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Group Settings</h1>
                        <p className="text-sm text-slate-500">Manage group details and members</p>
                    </div>
                </div>
                {renderError()}
                {/* Basic Info Section */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                    <h2 className="text-lg font-bold text-slate-900">Basic Information</h2>

                    {/* Group Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Group Name</label>
                        {isEditingName ? (
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    autoFocus
                                />
                                <button
                                    onClick={handleSaveName}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                >
                                    <Check size={20} />
                                </button>
                                <button
                                    onClick={() => setIsEditingName(false)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <span className="font-medium text-slate-900">{group.name}</span>
                                <button
                                    onClick={() => {
                                        setEditedName(group.name);
                                        setIsEditingName(true);
                                    }}
                                    className="p-1.5 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                                >
                                    <Edit2 size={16} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Group Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                        {isEditingDescription ? (
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={editedDescription}
                                    onChange={(e) => setEditedDescription(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Add a description..."
                                    autoFocus
                                />
                                <button
                                    onClick={handleSaveDescription}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                >
                                    <Check size={20} />
                                </button>
                                <button
                                    onClick={() => setIsEditingDescription(false)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <span className="text-slate-700">{group.description || 'No description'}</span>
                                <button
                                    onClick={() => {
                                        setEditedDescription(group.description || '');
                                        setIsEditingDescription(true);
                                    }}
                                    className="p-1.5 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                                >
                                    <Edit2 size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Members Section */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900">Members ({members.length})</h2>
                        <button
                            onClick={() => setIsAddingMember(true)}
                            className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                            <UserPlus size={16} />
                            <span>Add Member</span>
                        </button>
                    </div>

                    <div className="space-y-2">
                        {members.map((member) => (
                            <div key={member!.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-600">
                                        {member!.avatarUrl ? (
                                            <img src={member!.avatarUrl} alt={member!.fullName} className="w-full h-full rounded-full" />
                                        ) : (
                                            member!.firstName.charAt(0)
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">{member!.fullName}</p>
                                        <p className="text-xs text-slate-500">{member!.email}</p>
                                    </div>
                                </div>
                                {member!.id !== currentUserId && (
                                    <button
                                        onClick={() => handleRemoveMember(member!.id)}
                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Add Member Modal */}
                {isAddingMember && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-slate-900">Add Member</h3>
                                <button onClick={() => setIsAddingMember(false)} className="text-slate-400 hover:text-slate-600">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-4 max-h-96 overflow-y-auto">
                                {availableUsers.length === 0 ? (
                                    <p className="text-center text-slate-500 py-8">All users are already members</p>
                                ) : (
                                    <div className="space-y-2">
                                        {availableUsers.map(user => (
                                            <button
                                                key={user.id}
                                                onClick={() => handleAddMember(user.id)}
                                                className="w-full flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-lg transition-colors"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-600">
                                                    {user.avatarUrl ? (
                                                        <img src={user.avatarUrl} alt={user.firstName} className="w-full h-full rounded-full" />
                                                    ) : (
                                                        user.firstName.charAt(0)
                                                    )}
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <p className="font-medium text-slate-900">{user.fullName}</p>
                                                    <p className="text-xs text-slate-500">{user.email}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Danger Zone */}
                <div className="bg-white rounded-xl border border-red-200 shadow-sm p-6 space-y-4">
                    <h2 className="text-lg font-bold text-red-900">Danger Zone</h2>

                    <div className="space-y-3">
                        {/* Leave Group */}
                        <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
                            <div>
                                <p className="font-medium text-red-900">Leave Group</p>
                                <p className="text-sm text-red-700">You will no longer have access to this group</p>
                            </div>
                            <button
                                onClick={() => setShowLeaveConfirm(true)}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                            >
                                <LogOut size={16} />
                                <span>Leave</span>
                            </button>
                        </div>

                        {/* Delete Group */}
                        <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
                            <div>
                                <p className="font-medium text-red-900">Delete Group</p>
                                <p className="text-sm text-red-700">Permanently delete this group and all its data</p>
                            </div>
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                            >
                                <Trash2 size={16} />
                                <span>Delete</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Leave Confirmation Modal */}
                {showLeaveConfirm && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                    <LogOut className="text-red-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Leave Group?</h3>
                                    <p className="text-sm text-slate-500">You will no longer have access to this group</p>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowLeaveConfirm(false)}
                                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLeaveGroup}
                                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    Leave Group
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                    <Trash2 className="text-red-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Delete Group?</h3>
                                    <p className="text-sm text-slate-500">This action cannot be undone</p>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteGroup}
                                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    Delete Forever
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}

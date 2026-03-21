import { Check } from "lucide-react";
import { clsx } from "clsx";
import type { User } from "../../domain/models";

export function GroupMember({ user, isSelected, toggleMember }: { user: User, isSelected: boolean, toggleMember: (userId: string | number) => void }) {
    return (
        <div
            onClick={() => toggleMember(user.id)}
            className={clsx(
                "flex items-center p-4 cursor-pointer transition-all duration-300 relative overflow-hidden group/member",
                isSelected ? "bg-primary-50/50" : "hover:bg-white"
            )}
        >
            <div className={clsx(
                "w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-all duration-300 shadow-sm",
                isSelected
                    ? "bg-primary-700 border-primary-700 text-white scale-110 shadow-primary-500/30"
                    : "border-slate-200 bg-white group-hover/member:border-primary-300"
            )}>
                {isSelected && <Check size={14} strokeWidth={3} />}
            </div>

            <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-sm font-black text-slate-500 mr-4 shadow-inner group-hover/member:bg-white transition-colors">
                {user.avatarUrl ? <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full rounded-2xl object-cover" /> : user.firstName.charAt(0)}
            </div>

            <div className="flex-1 min-w-0">
                <p className={clsx(
                    "text-sm font-black truncate transition-colors",
                    isSelected ? "text-primary-900" : "text-slate-800 group-hover/member:text-primary-700"
                )}>
                    {user.fullName}
                </p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight truncate group-hover/member:text-slate-600">
                    {user.email}
                </p>
            </div>

            {isSelected && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <span className="text-[10px] font-black text-primary-700 uppercase tracking-widest bg-white px-2 py-1 rounded-lg border border-primary-100 shadow-sm animate-in fade-in slide-in-from-right-2">
                        Member
                    </span>
                </div>
            )}
        </div>
    );
}

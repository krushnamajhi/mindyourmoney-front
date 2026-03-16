import { X } from "lucide-react";

export function ModalHeader({ title, description, icon, onCancel }: { title: string, description: string, icon: React.ReactNode, onCancel: () => void }) {
    return (
        <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-700 rounded-xl text-white shadow-lg shadow-primary-500/20">
                    {icon}
                </div>
                <div>
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">
                        {title}
                    </h2>
                    <p className="text-xs text-slate-600 font-medium tracking-wide">
                        {description}
                    </p>
                </div>
            </div>
            <button onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-all">
                <X size={24} />
            </button>
        </div>
    )
}
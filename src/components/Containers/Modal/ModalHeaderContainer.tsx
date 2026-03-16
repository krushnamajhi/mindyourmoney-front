import { Settings, Tag, Users, X } from "lucide-react"
import { useAppDispatch, useAppSelector } from "../../../store/hooks"
import { closeModal } from "../../../store/modalSlice";

export default function ModalHeaderContainer() {

    const IconMap = {
        Users: <Users size={20} />,
        Tag: <Tag size={20} />,
        Settings: <Settings size={20} />,
    };

    const { data } = useAppSelector((state) => state.modal);
    const dispatch = useAppDispatch();

    return (
        <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-700 rounded-xl text-white shadow-lg shadow-primary-500/20">
                    {data.icon && IconMap[data.icon]}
                </div>
                <div>
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">
                        {data.title}
                    </h2>
                    <p className="text-xs text-slate-600 font-medium tracking-wide">
                        {data.description}
                    </p>
                </div>
            </div>
            <button onClick={() => dispatch(closeModal())} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-all">
                <X size={24} />
            </button>
        </div>
    )
}
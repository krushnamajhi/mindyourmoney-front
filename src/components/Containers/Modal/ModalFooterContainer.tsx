import { Save } from "lucide-react"
import { useAppDispatch, useAppSelector } from "../../../store/hooks"
import { closeModal } from "../../../store/modalSlice";

export default function ModalFooterContainer() {
    const { data, isPending, modalId } = useAppSelector((state) => state.modal)
    const dispatch = useAppDispatch();

    return (
        <div className="p-8 border-t border-slate-100 bg-slate-50 flex space-x-3">
            <button
                type="button"
                onClick={() => dispatch(closeModal())}
                className="flex-1 py-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-2xl font-black text-sm transition-all shadow-sm"
            >
                {data.cancelLabel}
            </button>
            {data.submitLabel && <button
                type="submit"
                form={`modal-form-${modalId}`}
                disabled={isPending}
                className="flex-[2] flex items-center justify-center space-x-2 py-4 bg-primary-900 hover:bg-primary-800 text-white rounded-2xl font-black text-sm shadow-xl shadow-primary-500/20 transition-all active:scale-[0.98] disabled:opacity-70"
            >
                {isPending ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                        <Save size={18} />
                        <span>{data.submitLabel}</span>
                    </>
                )}
            </button>}
        </div>
    )
}
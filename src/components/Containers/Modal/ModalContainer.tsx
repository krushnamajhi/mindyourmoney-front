import type { ReactNode } from "react";
import ModalHeaderContainer from "./ModalHeaderContainer";
import ModalFooterContainer from "./ModalFooterContainer";
import ModalBodyContainer from "./ModalBodyContainer";
import { useAppSelector } from "../../../store/hooks";
import { createPortal } from "react-dom";


export default function ModalContainer({ children }: { children: ReactNode }) {
    const { isOpen } = useAppSelector((state) => state.modal);
    return (
        isOpen && createPortal(<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 animate-in fade-in duration-300 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                <ModalHeaderContainer />
                <ModalBodyContainer>
                    {children}
                </ModalBodyContainer>
                <ModalFooterContainer />
            </div>
        </div>, document.body)
    );
}
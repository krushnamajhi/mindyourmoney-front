import type { ReactNode } from "react";

export default function ModalBodyContainer({ children }: { children: ReactNode }) {
    return (
        <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
            {children}
        </div>
    )
}
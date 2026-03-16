import { clsx } from "clsx";

interface BaseCardProps {
    children: React.ReactNode;
    onClick?: () => void;
    onMouseLeave?: () => void;
    className?: string;
    headerIcon?: React.ReactNode;
    actions?: React.ReactNode;
}

export function BaseCard({
    children,
    onClick,
    onMouseLeave,
    className,
    headerIcon,
    actions
}: BaseCardProps) {
    return (
        <div
            onClick={onClick}
            onMouseLeave={onMouseLeave}
            className={clsx(
                "group relative glass-morphism rounded-2xl p-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer border border-white/20 bg-white/40",
                className
            )}
        >
            <div className="p-3 flex-1 flex flex-col relative">
                {/* Header Row */}
                {(headerIcon || actions) && (
                    <div className="flex justify-between items-start mb-2">
                        <div className="w-10 h-10 rounded-xl hover:bg-primary-800/10 flex items-center justify-center text-primary-900 group-hover:bg-primary-800 group-hover:text-white transition-all duration-300">
                            {headerIcon}
                        </div>
                        <div className="flex-shrink-0">
                            {actions}
                        </div>
                    </div>
                )}

                {children}
            </div>
        </div>
    );
}

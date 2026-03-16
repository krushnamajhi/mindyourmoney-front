import clsx from "clsx";
import { Settings } from "lucide-react";
import { useMenu } from "../../../../context/MenuContext";

export default function SettingsMenuOption({ onClick }: { onClick: React.MouseEventHandler<HTMLButtonElement> | undefined }) {
    const { compact, size } = useMenu();
    const iconSize = size === 'small' ? 14 : size === 'medium' ? 16 : 20;
    const fontSize = size === 'small' ? 'text-xs' : size === 'medium' ? 'text-sm' : 'text-base';
    return (
        <button
            key={"settings"}
            onClick={onClick}
            className={clsx("flex items-center space-x-2 text-sm", "text-slate-600 hover:bg-slate-50 w-full text-left", compact ? 'px-2 py-1' : 'px-4 py-2')}
        >
            <Settings size={iconSize} />
            {!compact && <span className={fontSize}>Settings</span>}
        </button>
    )
}
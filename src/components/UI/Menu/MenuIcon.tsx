import { MoreVertical } from 'lucide-react';
import { useMenu } from '../../../context/MenuContext';

export default function MenuIcon() {
    const { toggleMenu, open, compact } = useMenu();
    return (
        compact ? null : <button
            onClick={(e) => {
                e.stopPropagation();
                toggleMenu(!open);
            }}
            className="p-1.5 hover:bg-white text-slate-600 rounded-full hover:shadow-sm backdrop-blur-sm transition-all"
        >
            <MoreVertical size={16} />
        </button>
    )
}
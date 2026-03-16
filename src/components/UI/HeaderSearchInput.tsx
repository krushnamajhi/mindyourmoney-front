import { Search } from "lucide-react";

interface HeaderSearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
}

export function HeaderSearchInput({ className, ...props }: HeaderSearchInputProps) {
    return (
        <div className="relative hidden md:block">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input
                type="text"
                className="pl-10 pr-4 py-2.5 rounded-md bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
                {...props}
            />
        </div>
    );
}
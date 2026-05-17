import { Search } from 'lucide-react';
import { useEffect, useState } from 'react'

export default function SearchInput({ setDebouncedValue, placeholder = "Please Enter Searched Text" }: { setDebouncedValue: (value: string) => void, placeholder: string }) {
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(searchQuery), 300);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    return (
        <div className="relative group/search">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-primary-600 transition-colors" size={16} />
            <input
                type="text"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500/30 transition-all shadow-inner"
            />
        </div>
    )
}
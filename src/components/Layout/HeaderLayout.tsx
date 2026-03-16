import clsx from "clsx";

interface HeaderLayoutProps {
    title: string;
    description: string;
    size?: 'lg' | 'md' | 'sm';
    children: React.ReactNode
}

export function HeaderLayout({ title, description, size, children }: HeaderLayoutProps) {
    return <header className="flex items-center justify-between grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
            <h2 className={clsx("text-2xl font-bold text-slate-900", size === 'lg' && "text-3xl", size === 'md' && "text-2xl", size === 'sm' && "text-xl")}>{title}</h2>
            <p className="text-slate-500">{description}</p>
        </div>
        <div className="flex space-x-3 justify-end">
            {children}
        </div>
    </header>
}
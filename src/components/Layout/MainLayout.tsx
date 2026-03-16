import { LayoutDashboard, Receipt, Settings, Wallet, X, PanelLeftClose, PanelLeftOpen, LogOut, GroupIcon, Users2, Tag } from 'lucide-react';
import { clsx } from 'clsx';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

interface MainLayoutProps {
    children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isSidebarOpen, setSidebarOpen] = useState(false); // Default collapsed on all, or maybe true for desktop? 
    // Mobile-first usually means collapsed default.

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
    return (
        <div className="flex h-screen overflow-hidden relative">
            {/* Liquid Background */}
            <div className="liquid-bg-container">
                <div className="liquid-blob bg-indigo-200 w-[500px] h-[500px] -top-24 -left-24 animate-[liquid_25s_infinite_alternate]" />
                <div className="liquid-blob bg-emerald-100 w-[600px] h-[600px] top-1/2 -right-32 animate-[liquid_30s_infinite_alternate-reverse]" />
                <div className="liquid-blob bg-rose-100 w-[400px] h-[400px] -bottom-24 left-1/2 animate-[liquid_20s_infinite_alternate]" />
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/10 z-40 backdrop-blur-sm lg:hidden animate-[fade-in_0.3s_ease-out]"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={clsx(
                    "fixed lg:static inset-y-0 left-0 z-50 w-64 glass-sidebar flex flex-col transition-transform duration-300 ease-in-out lg:shadow-none",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:-ml-64"
                )}
            >
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="bg-primary-600 rounded-lg p-1.5 shadow-lg shadow-primary-500/30">
                            <Wallet className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">ExpenseTracker</h1>
                            <span className="text-xs text-slate-500 font-medium tracking-wide">PREMIUM PLAN</span>
                        </div>
                    </div>
                    {/* Close Button - Mobile (X) and Desktop (PanelLeftClose) */}
                    <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-slate-600">
                        <X size={24} className="lg:hidden" />
                        <PanelLeftClose size={24} className="hidden lg:block" />
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-1 py-4">
                    <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" active={location.pathname === '/dashboard'} onClick={() => setSidebarOpen(false)} />
                    <NavItem to="/expenses" icon={<Receipt size={20} />} label="Transactions" active={location.pathname === '/expenses'} onClick={() => setSidebarOpen(false)} />
                    <NavItem to="/groups" icon={<GroupIcon size={20} />} label="Groups" active={location.pathname === '/groups'} onClick={() => setSidebarOpen(false)} />
                    <NavItem to="/expense-categories" icon={<Tag size={20} />} label="Categories" active={location.pathname === '/expense-categories'} onClick={() => setSidebarOpen(false)} />
                    <NavItem to="/non-groups" icon={<Users2 size={20} />} label="Non-Groups" active={location.pathname === '/non-groups'} onClick={() => setSidebarOpen(false)} />
                </nav>

                <div className="p-4 border-t border-slate-100 space-y-1">
                    <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" active={location.pathname === '/settings'} onClick={() => setSidebarOpen(false)} />

                    <button
                        onClick={() => {
                            logout();
                            navigate('/login');
                        }}
                        className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg transition-all duration-200 text-red-600 hover:bg-red-50 font-medium group text-left outline-none"
                    >
                        <LogOut size={20} className="text-red-400 group-hover:text-red-600 transition-colors" />
                        <span>Logout</span>
                    </button>

                    <div className="pt-4 mt-2">
                        <div className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-white/40 border border-white/20 backdrop-blur-sm shadow-sm transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer group">
                            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold overflow-hidden shadow-inner ring-2 ring-white/50 group-hover:ring-primary-500/50 transition-all">
                                {user?.avatarUrl ? <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" /> : (user?.firstName?.charAt(0) || 'U')}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-primary-700 transition-colors">{user?.fullName || (user ? `${user.firstName} ${user.lastName}` : 'Guest User')}</p>
                                <p className="text-xs text-slate-500 truncate">{user?.email || 'guest@example.com'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={clsx(
                "flex-1 flex flex-col w-full min-w-0 transition-all duration-300 relative bg-transparent",
                isSidebarOpen && "blur-sm pointer-events-none lg:blur-none lg:pointer-events-auto"
            )}>
                <header className="bg-white/60 backdrop-blur-md border-b border-white/20 px-4 py-3 flex items-center lg:hidden">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 text-slate-600 hover:bg-white/40 rounded-lg transition-colors"
                    >
                        <PanelLeftOpen size={24} />
                    </button>
                    <span className="ml-3 font-semibold text-slate-900">
                        {location.pathname === '/dashboard' ? 'Dashboard' :
                            location.pathname === '/expenses' ? 'Transactions' :
                                location.pathname === '/groups' ? 'Groups' :
                                    location.pathname === '/expense-categories' ? 'Expense Categories' :
                                        location.pathname === '/settings' ? 'Settings' : 'ExpenseTracker'}
                    </span>
                </header>

                {/* Desktop Toggle (When collapsed) */}
                <div className="hidden lg:block absolute top-4 left-4 z-40">
                    {!isSidebarOpen && (
                        <button
                            onClick={toggleSidebar}
                            className="p-2 bg-white/60 backdrop-blur-md border border-white/20 text-slate-600 hover:bg-white/80 rounded-lg shadow-sm transition-all"
                            title="Expand Sidebar"
                        >
                            <PanelLeftOpen size={24} />
                        </button>
                    )}
                </div>

                <div className={clsx("flex-1 overflow-auto p-4 md:p-8 pt-16", !isSidebarOpen ? "lg:pt-20" : "lg:pt-8")}>
                    {children}
                </div>
            </main>
        </div>
    );
}

function NavItem({ icon, label, active, to, onClick }: { icon: React.ReactNode; label: string; active?: boolean; to: string; onClick?: () => void }) {
    return (
        <Link
            to={to}
            onClick={onClick}
            className={clsx(
                "flex items-center space-x-3 px-4 py-3 w-full rounded-lg transition-all duration-200 group",
                active
                    ? "bg-primary-50 text-primary-700 font-medium shadow-sm ring-1 ring-primary-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
        >
            <span className={clsx("transition-colors", active ? "text-primary-600" : "text-slate-400 group-hover:text-slate-600")}>
                {icon}
            </span>
            <span>{label}</span>
        </Link>
    );
}



import { useRef } from 'react';
import { MainLayout } from '../components/Layout/MainLayout';
import { currencies, useSettings, type Currency } from '../context/SettingsContext';
import { Check, Globe } from 'lucide-react';
import { clsx } from 'clsx';

export function SettingsPage() {
    const { currency, setCurrency } = useSettings();
    const successMessageRef = useRef<HTMLDivElement>(null);

    const handleCurrencyChange = (newCurrency: Currency) => {
        setCurrency(newCurrency);
        // Show success message briefly
        if (successMessageRef.current) {
            successMessageRef.current.classList.remove('opacity-0');
            setTimeout(() => {
                if (successMessageRef.current) {
                    successMessageRef.current.classList.add('opacity-0');
                }
            }, 2000);
        }
    };
    return (
        <MainLayout>
            <div className="max-w-3xl mx-auto space-y-6">
                <header>
                    <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
                    <p className="text-slate-500">Manage your application preferences and localization.</p>
                </header>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center space-x-2">
                        <Globe className="text-slate-400" size={20} />
                        <h3 className="font-semibold text-slate-900">Localization</h3>
                    </div>

                    <div className="p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
                            <p className="text-sm text-slate-500 mb-4">Select your preferred currency for display across the application.</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {currencies.map((c) => (
                                    <button
                                        key={c.code}
                                        onClick={() => handleCurrencyChange(c.code)}
                                        className={clsx(
                                            "flex items-center justify-between p-4 rounded-lg border text-left transition-all",
                                            currency === c.code
                                                ? "bg-primary-50 border-primary-500 ring-1 ring-primary-500"
                                                : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                        )}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className={clsx(
                                                "w-10 h-10 rounded-full flex items-center justify-center font-bold",
                                                currency === c.code ? "bg-primary-100 text-primary-700" : "bg-slate-100 text-slate-500"
                                            )}>
                                                {c.symbol}
                                            </div>
                                            <div>
                                                <p className={clsx("font-medium", currency === c.code ? "text-primary-900" : "text-slate-900")}>
                                                    {c.label}
                                                </p>
                                                <p className="text-xs text-slate-500">{c.code}</p>
                                            </div>
                                        </div>
                                        {currency === c.code && (
                                            <div className="text-primary-600">
                                                <Check size={20} />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                        <div ref={successMessageRef} className="opacity-0 transition-opacity duration-300 flex items-center text-emerald-600 text-sm font-medium">
                            <Check size={16} className="mr-1.5" />
                            Settings saved successfully
                        </div>
                        {/* 
                        // Auto-save is implemented, but could have a manual save button if needed. 
                        // For now, prompt implies "Select... default state". Auto-save is better UX.
                        */}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

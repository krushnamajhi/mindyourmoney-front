import React, { createContext, useContext, useState, useEffect } from 'react';

export type Currency = 'USD' | 'INR' | 'EUR' | 'JPY';

export const currencies: { code: Currency; label: string; symbol: string }[] = [
    { code: 'USD', label: 'US Dollar', symbol: '$' },
    { code: 'INR', label: 'Indian Rupee', symbol: '₹' },
    { code: 'EUR', label: 'Euro', symbol: '€' },
    { code: 'JPY', label: 'Japanese Yen', symbol: '¥' },
];

interface SettingsContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    formatCurrency: (amount: number) => string;
    getDefaultCurrencySymbol: () => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrencyState] = useState<Currency>('INR');

    useEffect(() => {
        const savedCurrency = localStorage.getItem('app_currency') as Currency;
        if (savedCurrency) {
            setCurrencyState(savedCurrency);
        }
    }, []);

    const setCurrency = (c: Currency) => {
        setCurrencyState(c);
        localStorage.setItem('app_currency', c);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    const getDefaultCurrencySymbol = () => {
        return currencies.find(c => c.code === currency)?.symbol || '';
    };

    return (
        <SettingsContext.Provider value={{ currency, setCurrency, formatCurrency, getDefaultCurrencySymbol }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}

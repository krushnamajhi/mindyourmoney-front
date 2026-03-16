export interface CategoryTheme {
    color: string;
    bgColor: string;
    icon: string;
}

const THEMES: Record<string, CategoryTheme> = {
    'Food & Drink': { color: 'text-orange-700', bgColor: 'bg-orange-100', icon: '🍔' },
    'Groceries': { color: 'text-emerald-700', bgColor: 'bg-emerald-100', icon: '🛒' },
    'Utilities': { color: 'text-blue-700', bgColor: 'bg-blue-100', icon: '💡' },
    'Transport': { color: 'text-indigo-700', bgColor: 'bg-indigo-100', icon: '🚗' },
    'Housing': { color: 'text-amber-700', bgColor: 'bg-amber-100', icon: '🏠' },
    'Entertainment': { color: 'text-purple-700', bgColor: 'bg-purple-100', icon: '🎬' },
    'Health': { color: 'text-rose-700', bgColor: 'bg-rose-100', icon: '🏥' },
    'Income': { color: 'text-green-700', bgColor: 'bg-green-100', icon: '💰' },
    'Other': { color: 'text-slate-700', bgColor: 'bg-slate-100', icon: '📦' },
};

export function getCategoryTheme(name?: string): CategoryTheme {
    if (!name) return THEMES['Other'];

    // Exact match
    if (THEMES[name]) return THEMES[name];

    // Case insensitive match
    const foundKey = Object.keys(THEMES).find(k => k.toLowerCase() === name.toLowerCase());
    if (foundKey) return THEMES[foundKey];

    // Fallback based on first letter
    return {
        color: 'text-primary-700',
        bgColor: 'bg-primary-50',
        icon: name.charAt(0).toUpperCase() || '📦'
    };
}

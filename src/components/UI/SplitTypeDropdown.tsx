import { BaseSelect, type BaseSelectOption } from "./BaseSelect";

interface SplitTypeDropdownProps {
    value: any;
    onChange: (value: any) => void;
    options?: BaseSelectOption[];
    disabled?: boolean;
}

export const splitTypeOptions: BaseSelectOption[] = [
    { label: '👥 Equal', value: 'EQUAL' },
    { label: '📊 Percent(%)', value: 'PERCENT' },
    { label: '⚖️ Exact', value: 'EXACT' },
    { label: '📈 Shares', value: 'SHARES' },
    { label: '🛒 Items', value: 'ITEMS' },
];

export function SplitTypeDropdown({ value, onChange, options = splitTypeOptions, disabled }: SplitTypeDropdownProps) {
    return (
        <div className="space-y-2">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest px-1">
                Split Method
            </label>
            <BaseSelect
                value={value}
                onChange={onChange}
                options={options}
                disabled={disabled}
                placeholder="Select Split Method"
            />
        </div>
    );
}
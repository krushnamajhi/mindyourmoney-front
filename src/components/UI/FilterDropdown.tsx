import { BaseSelect } from "../UI/BaseSelect";
import type { BaseSelectOption } from "../UI/BaseSelect";

interface FilterDropdownProps {
    icon?: React.ReactNode;
    options: (string | BaseSelectOption)[];
    value: string;
    onChange: (val: string) => void;
    disabled?: boolean;
    className?: string;
}

export function FilterDropdown(props: FilterDropdownProps) {
    // Composition: Domain-specific wrapper for UI primitive
    return <BaseSelect {...props} />;
}

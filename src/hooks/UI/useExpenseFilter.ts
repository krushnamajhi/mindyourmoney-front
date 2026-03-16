import { useState } from 'react';
import { Filter_ALL, Filter_NONE, type ExpenseFilters, type MultiSelectFilter } from '../../domain/models';

export function useExpenseFilter(onFilter: (filters: ExpenseFilters) => void) {
    const nonGroup = { value: Filter_NONE, label: "Non-Group" };
    const allGroups = { value: Filter_ALL, label: "All Groups" };
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGroup, setSelectedGroup] = useState<MultiSelectFilter<number | typeof Filter_NONE>>(Filter_ALL);
    const [expenseCategoryId, setExpenseCategoryId] = useState<MultiSelectFilter<number | typeof Filter_NONE>>(Filter_ALL);
    const [isShared, setIsShared] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (startDate && endDate && startDate > endDate) {
            alert("Start date cannot be after end date");
            return;
        }

        onFilter({
            startDate: startDate,
            endDate: endDate,
            title: searchQuery,
            groupId: isShared ? selectedGroup : [nonGroup.value], // Wrap in array to match (number | "NONE")[]
            expenseCategoryId: expenseCategoryId,
            isShared: [isShared], // Schema expects array or ALL
            // Note: startDate/endDate are not in current schema, matching schema for now
        } as any);
    };

    return {
        searchQuery,
        setSearchQuery,
        selectedGroup,
        setSelectedGroup,
        expenseCategoryId,
        setExpenseCategoryId,
        isShared,
        setIsShared,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        handleSubmit,
        nonGroup,
        allGroups
    };
}

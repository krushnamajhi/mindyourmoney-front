import { useState } from 'react';
import { Filter_ALL, Filter_NONE, type ExpenseFilters, type MultiSelectFilter } from '../../domain/models';

export function useExpenseFilter(onFilter: (filters: ExpenseFilters) => void) {
    const nonGroup = { value: Filter_NONE, label: "Non-Group" };
    const allGroups = { value: Filter_ALL, label: "All Groups" };
    const sharedTypeValue = 'SHARED';
    const personalTypeValue = 'PERSONAL';
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGroup, setSelectedGroup] = useState<MultiSelectFilter<number | typeof Filter_NONE>>(Filter_ALL);
    const [expenseCategoryId, setExpenseCategoryId] = useState<MultiSelectFilter<number | typeof Filter_NONE>>(Filter_ALL);
    const [expenseTypes, setExpenseTypes] = useState<string[]>([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (startDate && endDate && startDate > endDate) {
            alert("Start date cannot be after end date");
            return;
        }
        const hasShared = expenseTypes.includes(sharedTypeValue);
        const hasPersonal = expenseTypes.includes(personalTypeValue);
        const isSharedOnly = hasShared && !hasPersonal;
        const isSharedFilter =
            isSharedOnly
                ? [true]
                : !hasShared && hasPersonal
                    ? [false]
                    : Filter_ALL;

        onFilter({
            startDate: startDate,
            endDate: endDate,
            title: searchQuery,
            groupId: isSharedOnly ? selectedGroup : Filter_ALL,
            expenseCategoryId: expenseCategoryId,
            isShared: isSharedFilter,
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
        expenseTypes,
        setExpenseTypes,
        sharedTypeValue,
        personalTypeValue,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        handleSubmit,
        nonGroup,
        allGroups
    };
}

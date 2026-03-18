import { useState } from "react";
import { Group, Filter as FilterIcon, ChevronDown, Tag } from "lucide-react";
import { Button } from "../UI/Button";
import { useGroups } from "../../hooks/useGroups";
import { useExpenseCategories } from "../../hooks/useExpenseCategories";
import { DateInput } from "../UI/DateInput";
import { useExpenseFilter } from "../../hooks/UI/useExpenseFilter";
import { MultiselectFilter } from "../UI/MultiselectFilter";
import { Filter_ALL, Filter_NONE, type ExpenseFilters } from "../../domain/models";

interface ExpenseFilterProps {
    onFilter: (filters: ExpenseFilters) => void;
}

export function ExpenseFilter({ onFilter }: ExpenseFilterProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const {
        searchQuery, setSearchQuery,
        selectedGroup, setSelectedGroup,
        expenseCategoryId, setExpenseCategoryId,
        expenseTypes, setExpenseTypes,
        sharedTypeValue, personalTypeValue,
        startDate, setStartDate,
        endDate, setEndDate,
        handleSubmit,
        nonGroup
    } = useExpenseFilter(onFilter);

    const hasSharedSelected = expenseTypes.includes(sharedTypeValue);

    const { data: categories } = useExpenseCategories();
    const { data: groups } = useGroups();

    return (
        <form className="bg-white/60 backdrop-blur-md rounded-xl border border-white/20 shadow-sm relative z-10" onSubmit={handleSubmit}>
            <button
                type="button"
                onClick={() => setIsExpanded(prev => !prev)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-slate-600 hover:bg-slate-50/60 transition-colors"
            >
                <div className="flex items-center gap-2 text-sm font-semibold">
                    <FilterIcon size={10} className="text-primary-500 text-[10px]" />
                    <span>Filters</span>
                </div>
                <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
                />
            </button>

            {/* Filter Controls */}
            <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                <div className="flex flex-wrap items-center gap-4 px-3 pb-3">

                    <div className="relative flex-1 max-w-sm">
                        <input
                            type="text"
                            placeholder="Search by Expense Title..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white/40 border border-white/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all backdrop-blur-sm h-[42px]"
                        />
                        <div className="absolute left-3 top-3 text-slate-400">
                            <FilterIcon size={18} />
                        </div>
                    </div>

                    <div className="h-6 w-px bg-slate-200 hidden md:block" />

                    <MultiselectFilter
                        icon={<Tag size={16} />}
                        options={[
                            ...(categories?.map(c => ({ label: c.name, value: c.id })) || [])
                        ]}
                        selectedValues={expenseCategoryId === Filter_ALL ? [] : expenseCategoryId.map(id => id.toString())}
                        onChange={(values) => setExpenseCategoryId(values.length === 0 ? Filter_ALL : values.map(Number))}
                        placeholder="Categories"
                    />

                    <DateInput
                        label="From"
                        value={startDate}
                        max={endDate || undefined}
                        onChange={(e) => setStartDate(e.target.value)}
                        title="Start Date"
                    />

                    <DateInput
                        label="To"
                        value={endDate}
                        min={startDate || undefined}
                        onChange={(e) => setEndDate(e.target.value)}
                        title="End Date"
                    />

                    <MultiselectFilter
                        icon={<FilterIcon size={16} />}
                        options={[
                            { label: 'Shared', value: sharedTypeValue },
                            { label: 'Personal', value: personalTypeValue },
                        ]}
                        selectedValues={expenseTypes}
                        onChange={(values) => {
                            setExpenseTypes(values);
                            const hasShared = values.includes(sharedTypeValue);
                            if (!hasShared) {
                                setSelectedGroup(Filter_ALL);
                            }
                        }}
                        placeholder="Type"
                    />

                    <MultiselectFilter
                        icon={<Group size={16} />}
                        options={[
                            { label: nonGroup.label, value: nonGroup.value },
                            ...(groups?.map(g => ({ label: g.name, value: g.id })) || [])
                        ]}
                        selectedValues={selectedGroup === Filter_ALL ? [] : selectedGroup.map(v => v.toString())}
                        onChange={(values) => setSelectedGroup(values.length === 0 ? Filter_ALL : values.map(v => v === Filter_NONE ? Filter_NONE : Number(v)))}
                        disabled={!hasSharedSelected}
                        placeholder="Groups"
                    />

                    <Button type="submit" size="sm" icon={<FilterIcon size={16} />}>
                        Filter
                    </Button>
                </div>
            </div>
        </form>
    );
}

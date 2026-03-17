import { memo, useCallback, useMemo, useRef } from 'react';
import { useVirtualizer, type VirtualItem } from '@tanstack/react-virtual';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { ExpenseRow, ExpenseRowYearWise } from '../../domain/models';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';
import { useExpenseRowsCollapse } from '../../hooks/UI/useExpenseRowsCollapse';

interface ExpenseRowsByDateProps {
    rows: ExpenseRowYearWise[];
    onExpenseClick: (expense: ExpenseRow) => void;
    hideGroupTag?: boolean;
    compact?: boolean;
    listHeight?: number;
}

type VisibleRow =
    | {
        kind: 'year';
        key: string;
        year: number;
        label: string;
        count: string;
        collapsed: boolean;
    }
    | {
        kind: 'month';
        key: string;
        year: number;
        month: string;
        label: string;
        count: string;
        collapsed: boolean;
    }
    | {
        kind: 'day';
        key: string;
        year: number;
        month: string;
        day: number;
        label: string;
        count: string;
        collapsed: boolean;
    }
    | {
        kind: 'expense';
        key: string;
        expense: ExpenseRow;
    };

const LIST_HEIGHT = 620;
const ROW_SIZE = {
    year: 52,
    month: 44,
    day: 40,
    expense: 70,
} as const;

const countMonthItems = (month: ExpenseRowYearWise['expensesPerYear'][number]): number =>
    month.expensesPerMonth.reduce((sum, day) => sum + day.expensesPerDay.length, 0);

const countYearItems = (year: ExpenseRowYearWise): number =>
    year.expensesPerYear.reduce((sum, month) => sum + countMonthItems(month), 0);

function buildVisibleRows(
    rows: ExpenseRowYearWise[],
    isYearCollapsed: (year: number) => boolean,
    isMonthCollapsed: (year: number, month: string) => boolean,
    isDayCollapsed: (year: number, month: string, day: number) => boolean,
): VisibleRow[] {
    const flattened: VisibleRow[] = [];

    for (const yearNode of rows) {
        const yearCollapsed = isYearCollapsed(yearNode.year);
        flattened.push({
            kind: 'year',
            key: `y-${yearNode.year}`,
            year: yearNode.year,
            label: `${yearNode.year}`,
            count: `${countYearItems(yearNode)} items`,
            collapsed: yearCollapsed,
        });

        if (yearCollapsed) continue;

        for (const monthNode of yearNode.expensesPerYear) {
            const monthCollapsed = isMonthCollapsed(yearNode.year, monthNode.month);
            flattened.push({
                kind: 'month',
                key: `m-${yearNode.year}-${monthNode.month}`,
                year: yearNode.year,
                month: monthNode.month,
                label: monthNode.month,
                count: `${countMonthItems(monthNode)} items`,
                collapsed: monthCollapsed,
            });

            if (monthCollapsed) continue;

            for (const dayNode of monthNode.expensesPerMonth) {
                const dayCollapsed = isDayCollapsed(yearNode.year, monthNode.month, dayNode.day);
                flattened.push({
                    kind: 'day',
                    key: `d-${yearNode.year}-${monthNode.month}-${dayNode.day}`,
                    year: yearNode.year,
                    month: monthNode.month,
                    day: dayNode.day,
                    label: `Day ${dayNode.day}`,
                    count: `${dayNode.expensesPerDay.length} items`,
                    collapsed: dayCollapsed,
                });

                if (dayCollapsed) continue;

                for (const expense of dayNode.expensesPerDay) {
                    flattened.push({
                        kind: 'expense',
                        key: `e-${expense.id}`,
                        expense,
                    });
                }
            }
        }
    }

    return flattened;
}

const estimateRowSize = (row: VisibleRow): number => {
    if (row.kind === 'expense') return ROW_SIZE.expense;
    if (row.kind === 'year') return ROW_SIZE.year;
    if (row.kind === 'month') return ROW_SIZE.month;
    return ROW_SIZE.day;
};

type FormatCurrency = (amount: number) => string;

export function ExpenseRowsByDate({
    rows,
    onExpenseClick,
    hideGroupTag = false,
    compact = false,
    listHeight = LIST_HEIGHT,
}: ExpenseRowsByDateProps) {
    const parentRef = useRef<HTMLDivElement>(null);
    const { formatCurrency } = useSettings();
    const { user: loggedInUser } = useAuth();
    const loggedInUserId = loggedInUser?.id ? String(loggedInUser.id) : '';
    const {
        toggleYear,
        toggleMonth,
        toggleDay,
        isYearCollapsed,
        isMonthCollapsed,
        isDayCollapsed,
        collapseAll,
        expandAll,
    } = useExpenseRowsCollapse(rows);

    const visibleRows = useMemo(
        () => buildVisibleRows(rows, isYearCollapsed, isMonthCollapsed, isDayCollapsed),
        [rows, isYearCollapsed, isMonthCollapsed, isDayCollapsed],
    );

    const rowVirtualizer = useVirtualizer({
        count: visibleRows.length,
        getScrollElement: () => parentRef.current,
        getItemKey: (index) => visibleRows[index]?.key ?? index,
        estimateSize: (index) => {
            const row = visibleRows[index];
            if (!row) return ROW_SIZE.month;
            return estimateRowSize(row);
        },
        overscan: 10,
    });

    const handleToggle = useCallback((row: VisibleRow) => {
        if (row.kind === 'year') {
            toggleYear(row.year);
            return;
        }
        if (row.kind === 'month') {
            toggleMonth(row.year, row.month);
            return;
        }
        if (row.kind === 'day') {
            toggleDay(row.year, row.month, row.day);
        }
    }, [toggleYear, toggleMonth, toggleDay]);

    const renderRow = useCallback((virtualRow: VirtualItem) => {
        const row = visibleRows[virtualRow.index];
        if (!row) return null;

        return (
            <VirtualizedRow
                row={row}
                virtualRow={virtualRow}
                onToggle={handleToggle}
                onExpenseClick={onExpenseClick}
                measureElement={rowVirtualizer.measureElement}
                formatCurrency={formatCurrency}
                loggedInUserId={loggedInUserId}
                hideGroupTag={hideGroupTag}
                compact={compact}
            />
        );
    }, [visibleRows, rowVirtualizer, handleToggle, onExpenseClick, formatCurrency, loggedInUserId, hideGroupTag]);

    if (rows.length === 0) {
        return (
            <div className="px-6 py-12 text-center text-slate-500">
                No transactions found.
            </div>
        );
    }

    return (
        <div className={compact ? 'space-y-1 p-0' : 'space-y-3 p-3'}>
            <div className={compact ? 'flex items-center justify-end gap-2 pb-0 px-0' : 'flex items-center justify-end gap-2 pb-0'}>
                <button
                    type="button"
                    onClick={expandAll}
                    className="text-xs font-semibold text-primary-700 hover:text-primary-800"
                >
                    Expand All
                </button>
                <button
                    type="button"
                    onClick={collapseAll}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                    Collapse All
                </button>
            </div>

            <div
                ref={parentRef}
                className="overflow-auto rounded-xl border border-slate-200 bg-white"
                style={{ height: `${listHeight}px` }}
            >
                <div
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        width: '100%',
                        position: 'relative',
                    }}
                >
                    {rowVirtualizer.getVirtualItems().map(renderRow)}
                </div>
            </div>
        </div>
    );
}

const VirtualizedRow = memo(function VirtualizedRow({
    row,
    virtualRow,
    onToggle,
    onExpenseClick,
    measureElement,
    formatCurrency,
    loggedInUserId,
    hideGroupTag,
    compact,
}: {
    row: VisibleRow;
    virtualRow: VirtualItem;
    onToggle: (row: VisibleRow) => void;
    onExpenseClick: (expense: ExpenseRow) => void;
    measureElement: (element: HTMLDivElement | null) => void;
    formatCurrency: FormatCurrency;
    loggedInUserId: string;
    hideGroupTag?: boolean;
    compact?: boolean;
}) {
    return (
        <div
            key={row.key}
            ref={measureElement}
            data-index={virtualRow.index}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
            }}
        >
            {row.kind === 'year' && (
                <HeaderRow
                    collapsed={row.collapsed}
                    label={row.label}
                    count={row.count}
                    onToggle={() => onToggle(row)}
                    className="border-b border-slate-200 bg-slate-100 px-3 py-2 text-slate-900"
                />
            )}

            {row.kind === 'month' && (
                <HeaderRow
                    collapsed={row.collapsed}
                    label={row.label}
                    count={row.count}
                    onToggle={() => onToggle(row)}
                    className="border-b border-sky-100 bg-sky-50 pl-4 pr-3 py-1.5 text-sky-900"
                />
            )}

            {row.kind === 'day' && (
                <HeaderRow
                    collapsed={row.collapsed}
                    label={row.label}
                    count={row.count}
                    onToggle={() => onToggle(row)}
                    className="border-b border-emerald-100 bg-emerald-50 pl-6 pr-3 py-1.5 text-emerald-900"
                />
            )}

            {row.kind === 'expense' && (
                <div className={compact ? 'border-b border-slate-100 pl-4 pr-1' : 'border-b border-slate-100 pl-8 pr-2'}>
                    <ExpenseItemRow
                        expense={row.expense}
                        onClick={onExpenseClick}
                        formatCurrency={formatCurrency}
                        loggedInUserId={loggedInUserId}
                        hideGroupTag={hideGroupTag}
                        compact={compact}
                    />
                </div>
            )}
        </div>
    );
});

const HeaderRow = memo(function HeaderRow({
    onToggle,
    collapsed,
    label,
    count,
    className,
}: {
    onToggle: () => void;
    collapsed: boolean;
    label: string;
    count: string;
    className?: string;
}) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className={`flex w-full items-center justify-between hover:bg-slate-50 ${className || ''}`}
        >
            <span className="flex items-center gap-1.5 text-xs font-semibold">
                {collapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                {label}
            </span>
            <span className="text-[11px] text-slate-500">{count}</span>
        </button>
    );
});

const ExpenseItemRow = memo(function ExpenseItemRow({
    expense,
    onClick,
    formatCurrency,
    loggedInUserId,
    hideGroupTag,
    compact,
}: {
    expense: ExpenseRow;
    onClick: (expense: ExpenseRow) => void;
    formatCurrency: FormatCurrency;
    loggedInUserId: string;
    hideGroupTag?: boolean;
    compact?: boolean;
}) {
    const amount = Number(expense.amount || 0);
    const isSettledExpense = expense.isSettled === true;
    const isPersonalExpense = expense.isShared === false;
    const balance = Number(expense.balance || 0);
    const paidByLabel =
        loggedInUserId && String(expense.paidByUser?.id) === loggedInUserId
            ? 'You'
            : (expense.paidByUser?.fullName || 'Unknown User');
    const paidToLabel =
        loggedInUserId && String(expense.paidToUser?.id) === loggedInUserId
            ? 'You'
            : (expense.paidToUser?.fullName || 'Unknown User');
    const settledText = `${paidByLabel} settled ${formatCurrency(amount)} to ${paidToLabel}`;
    const settledTextClass =
        paidByLabel === 'You' ? 'text-red-600' : paidToLabel === 'You' ? 'text-emerald-600' : 'text-slate-600';

    const balanceTextClass =
        balance < 0 ? 'text-red-600' : balance > 0 ? 'text-emerald-600' : 'text-slate-500';

    const balanceLabel =
        balance < 0 ? 'You borrowed' : balance > 0 ? 'You lent' : 'Settled / Not included';

    const handleClick = useCallback(() => {
        onClick(expense);
    }, [onClick, expense]);

    return (
        <button
            type="button"
            onClick={handleClick}
            className={compact ? 'flex w-full items-center justify-between px-3 py-1.5 text-left hover:bg-slate-50' : 'flex w-full items-center justify-between px-4 py-2 text-left hover:bg-slate-50'}
        >
            <div className="min-w-0">
                {isSettledExpense ? (
                    <p className={`text-[15px] font-medium ${settledTextClass}`}>{settledText}</p>
                ) : !isPersonalExpense && (
                    <>
                        <p className="truncate text-base font-semibold text-slate-900">{expense.title}</p>
                        <p className="text-sm text-slate-500">
                            {paidByLabel} paid {formatCurrency(amount)}
                        </p>
                    </>
                )}
                {!isSettledExpense && isPersonalExpense && (
                    <p className="truncate text-base font-semibold text-slate-900">{expense.title}</p>
                )}
                <div className={compact ? 'mt-0.5 flex flex-wrap items-center gap-1.5' : 'mt-1 flex flex-wrap items-center gap-1.5'}>
                    {isSettledExpense ? (
                        <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
                            {expense.group?.name || 'Non-group'}
                        </span>
                    ) : (
                        <>
                            {isPersonalExpense && (
                                <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
                                    Personal
                                </span>
                            )}
                            {!hideGroupTag && expense.isShared && (
                                <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
                                    {expense.group?.name || 'Non-group'}
                                </span>
                            )}
                            {expense.expenseCategory?.name && (
                                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                                    {expense.expenseCategory.name}
                                </span>
                            )}
                        </>
                    )}
                </div>
            </div>

            {!isSettledExpense && (
                <div className={compact ? 'ml-3 text-right' : 'ml-4 text-right'}>
                    {isPersonalExpense ? (
                        <p className="text-base font-semibold text-slate-900">{formatCurrency(amount)}</p>
                    ) : (
                        <>
                            <p className={`text-base font-semibold ${balanceTextClass}`}>
                                {formatCurrency(Math.abs(balance))}
                            </p>
                            <p className={`text-sm ${balanceTextClass}`}>{balanceLabel}</p>
                        </>
                    )}
                </div>
            )}
        </button>
    );
});

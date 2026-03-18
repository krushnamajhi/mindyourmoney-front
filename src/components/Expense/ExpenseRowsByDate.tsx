import { memo, useCallback, useMemo, useRef } from 'react';
import { useVirtualizer, type VirtualItem } from '@tanstack/react-virtual';
import type { ExpenseRow, ExpenseRowYearMonthWise } from '../../domain/models';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';

interface ExpenseRowsByDateProps {
    rows: ExpenseRowYearMonthWise[];
    onExpenseClick: (expense: ExpenseRow) => void;
    hideGroupTag?: boolean;
    compact?: boolean;
    listHeight?: number;
}

type VisibleRow =
    | {
        kind: 'month';
        key: string;
        year: number;
        month: string;
        label: string;
        count: string;
    }
    | {
        kind: 'expense';
        key: string;
        expense: ExpenseRow;
    };

const LIST_HEIGHT = 620;
const ROW_SIZE = {
    month: 34,
    expense: 78,
} as const;

const countMonthItems = (month: ExpenseRowYearMonthWise): number =>
    month.expensesPerMonth.reduce((sum, day) => sum + day.expensesPerDay.length, 0);

function buildVisibleRows(rows: ExpenseRowYearMonthWise[]): VisibleRow[] {
    const flattened: VisibleRow[] = [];

    for (const monthNode of rows) {
        flattened.push({
            kind: 'month',
            key: `m-${monthNode.year}-${monthNode.month}`,
            year: monthNode.year,
            month: monthNode.month,
            label: `${monthNode.month} ${monthNode.year}`,
            count: `${countMonthItems(monthNode)} items`,
        });

        for (const dayNode of monthNode.expensesPerMonth) {
            for (const expense of dayNode.expensesPerDay) {
                flattened.push({
                    kind: 'expense',
                    key: `e-${expense.id}`,
                    expense,
                });
            }
        }
    }

    return flattened;
}

const estimateRowSize = (row: VisibleRow): number => {
    if (row.kind === 'expense') return ROW_SIZE.expense;
    return ROW_SIZE.month;
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

    const visibleRows = useMemo(() => buildVisibleRows(rows), [rows]);

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

    const renderRow = useCallback((virtualRow: VirtualItem) => {
        const row = visibleRows[virtualRow.index];
        if (!row) return null;

        return (
            <VirtualizedRow
                row={row}
                virtualRow={virtualRow}
                onExpenseClick={onExpenseClick}
                measureElement={rowVirtualizer.measureElement}
                formatCurrency={formatCurrency}
                loggedInUserId={loggedInUserId}
                hideGroupTag={hideGroupTag}
                compact={compact}
            />
        );
    }, [visibleRows, rowVirtualizer, onExpenseClick, formatCurrency, loggedInUserId, hideGroupTag, compact]);

    if (rows.length === 0) {
        return (
            <div className="px-6 py-12 text-center text-slate-500">
                No transactions found.
            </div>
        );
    }

    return (
        <div className={compact ? 'space-y-1 p-0' : 'space-y-1 p-1'}>
            <div
                ref={parentRef}
                className="overflow-auto bg-white"
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
    onExpenseClick,
    measureElement,
    formatCurrency,
    loggedInUserId,
    hideGroupTag,
    compact,
}: {
    row: VisibleRow;
    virtualRow: VirtualItem;
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
            {row.kind === 'month' && (
                <HeaderRow
                    label={row.label}
                    count={row.count}
                    className="border-b border-slate-200 bg-slate-50 px-2 py-1 text-slate-800"
                />
            )}

            {row.kind === 'expense' && (
                <div className={compact ? 'border-b border-slate-100 px-1' : 'border-b border-slate-100 px-1.5'}>
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
    label,
    count,
    className,
}: {
    label: string;
    count: string;
    className?: string;
}) {
    return (
        <div className={`flex w-full items-center justify-between ${className || ''}`}>
            <span className="text-[11px] font-semibold">{label}</span>
            <span className="text-[11px] text-slate-500">{count}</span>
        </div>
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

    const expenseDate = new Date(expense.expenseDate);
    const hasValidDate = !Number.isNaN(expenseDate.getTime());
    const monthLabel = hasValidDate
        ? expenseDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
        : '---';
    const dayLabel = hasValidDate
        ? expenseDate.toLocaleDateString('en-US', { day: '2-digit' })
        : '--';

    return (
        <button
            type="button"
            onClick={handleClick}
            className={compact ? 'flex w-full items-center justify-between gap-3 px-2 py-2 text-left hover:bg-slate-50' : 'flex w-full items-center justify-between gap-3 px-2.5 py-2.5 text-left hover:bg-slate-50'}
        >
            <div className="flex min-w-0 items-center gap-2.5">
                <div className="w-10 shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-1 py-1 text-center">
                    <p className="text-[10px] font-semibold uppercase leading-none text-slate-500">{monthLabel}</p>
                    <p className="mt-0.5 text-sm font-bold leading-none text-slate-800">{dayLabel}</p>
                </div>
                <div className="min-w-0">
                    {isSettledExpense ? (
                        <p className={`text-sm font-medium ${settledTextClass}`}>{settledText}</p>
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
            </div>

            {!isSettledExpense && (
                <div className={compact ? 'ml-2 text-right' : 'ml-3 text-right'}>
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

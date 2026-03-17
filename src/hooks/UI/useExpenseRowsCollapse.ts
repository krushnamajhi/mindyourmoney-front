import { useCallback, useMemo, useState } from 'react';
import type { ExpenseRowYearMonthWise } from '../../domain/models';

const dayKey = (year: number, month: string, day: number) => `${year}-${month}-${day}`;

const monthYearKey = (year: number, month: string) => `${year}-${month}`;

export function useExpenseRowsCollapse(rows: ExpenseRowYearMonthWise[]) {
    const monthKeys = useMemo(
        () => rows.map((ym) => monthYearKey(ym.year, ym.month)),
        [rows],
    );
    const dayKeys = useMemo(
        () => rows.flatMap((ym) => ym.expensesPerMonth.map((d) => dayKey(ym.year, ym.month, d.day))),
        [rows],
    );

    const [collapsedMonths, setCollapsedMonths] = useState<Set<string>>(() => new Set());
    const [collapsedDays, setCollapsedDays] = useState<Set<string>>(() => new Set());

    const toggleMonth = useCallback((year: number, month: string) => {
        const key = monthYearKey(year, month);
        setCollapsedMonths((prev) => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    }, []);

    const toggleDay = useCallback((year: number, month: string, day: number) => {
        const key = dayKey(year, month, day);
        setCollapsedDays((prev) => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    }, []);

    const isMonthCollapsed = useCallback((year: number, month: string) => collapsedMonths.has(monthYearKey(year, month)), [collapsedMonths]);
    const isDayCollapsed = useCallback((year: number, month: string, day: number) => collapsedDays.has(dayKey(year, month, day)), [collapsedDays]);

    const collapseAll = useCallback(() => {
        setCollapsedMonths(new Set(monthKeys));
        setCollapsedDays(new Set(dayKeys));
    }, [monthKeys, dayKeys]);

    const expandAll = useCallback(() => {
        setCollapsedMonths(new Set());
        setCollapsedDays(new Set());
    }, []);

    return useMemo(() => ({
        toggleMonth,
        toggleDay,
        isMonthCollapsed,
        isDayCollapsed,
        collapseAll,
        expandAll,
    }), [
        toggleMonth,
        toggleDay,
        isMonthCollapsed,
        isDayCollapsed,
        collapseAll,
        expandAll,
    ]);
}

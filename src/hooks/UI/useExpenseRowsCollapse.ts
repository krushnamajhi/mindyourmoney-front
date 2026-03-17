import { useCallback, useMemo, useState } from 'react';
import type { ExpenseRowYearWise } from '../../domain/models';

const monthKey = (year: number, month: string) => `${year}-${month}`;
const dayKey = (year: number, month: string, day: number) => `${year}-${month}-${day}`;

export function useExpenseRowsCollapse(rows: ExpenseRowYearWise[]) {
    const yearKeys = useMemo(() => rows.map((y) => y.year), [rows]);
    const monthKeys = useMemo(
        () => rows.flatMap((y) => y.expensesPerYear.map((m) => monthKey(y.year, m.month))),
        [rows],
    );
    const dayKeys = useMemo(
        () =>
            rows.flatMap((y) =>
                y.expensesPerYear.flatMap((m) => m.expensesPerMonth.map((d) => dayKey(y.year, m.month, d.day))),
            ),
        [rows],
    );

    const [collapsedYears, setCollapsedYears] = useState<Set<number>>(() => new Set());
    const [collapsedMonths, setCollapsedMonths] = useState<Set<string>>(() => new Set());
    const [collapsedDays, setCollapsedDays] = useState<Set<string>>(() => new Set());

    const toggleYear = useCallback((year: number) => {
        setCollapsedYears((prev) => {
            const next = new Set(prev);
            if (next.has(year)) next.delete(year);
            else next.add(year);
            return next;
        });
    }, []);

    const toggleMonth = useCallback((year: number, month: string) => {
        const key = monthKey(year, month);
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

    const isYearCollapsed = useCallback((year: number) => collapsedYears.has(year), [collapsedYears]);
    const isMonthCollapsed = useCallback((year: number, month: string) => collapsedMonths.has(monthKey(year, month)), [collapsedMonths]);
    const isDayCollapsed = useCallback((year: number, month: string, day: number) => collapsedDays.has(dayKey(year, month, day)), [collapsedDays]);

    const collapseAll = useCallback(() => {
        setCollapsedYears(new Set(yearKeys));
        setCollapsedMonths(new Set(monthKeys));
        setCollapsedDays(new Set(dayKeys));
    }, [yearKeys, monthKeys, dayKeys]);

    const expandAll = useCallback(() => {
        setCollapsedYears(new Set());
        setCollapsedMonths(new Set());
        setCollapsedDays(new Set());
    }, []);

    return useMemo(() => ({
        toggleYear,
        toggleMonth,
        toggleDay,
        isYearCollapsed,
        isMonthCollapsed,
        isDayCollapsed,
        collapseAll,
        expandAll,
    }), [
        toggleYear,
        toggleMonth,
        toggleDay,
        isYearCollapsed,
        isMonthCollapsed,
        isDayCollapsed,
        collapseAll,
        expandAll,
    ]);
}

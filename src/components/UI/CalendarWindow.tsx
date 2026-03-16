
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface CalendarWindowProps {
    value?: Date;
    onChange: (date: Date) => void;
    className?: string;
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function CalendarWindow({ value = new Date(), onChange, className }: CalendarWindowProps) {
    const [viewDate, setViewDate] = useState(new Date(value));

    // Helper to check if dates are same day
    const isSameDay = (d1: Date, d2: Date) => {
        return d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear();
    };

    // Helper to check if date is today
    const isToday = (date: Date) => {
        const today = new Date();
        return isSameDay(date, today);
    };

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const handlePrevMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    const handleDateClick = (day: number) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        // Preserve time if needed, but for calendar usually just date
        onChange(newDate);
    };

    const renderDays = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        const days = [];

        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="w-8 h-8 md:w-10 md:h-10" />);
        }

        // Days of current month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isSelected = isSameDay(date, value);
            const isCurrentDay = isToday(date);

            // Allow disabling dates based on min/max if needed
            // const isDisabled = (minDate && date < minDate) || (maxDate && date > maxDate);

            days.push(
                <button
                    key={day}
                    onClick={(e) => {
                        e.preventDefault(); // In case inside form
                        handleDateClick(day);
                    }}
                    className={cn(
                        "w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all duration-200 relative group",
                        isSelected
                            ? "bg-primary-600 text-white shadow-md shadow-primary-200 scale-105"
                            : "hover:bg-slate-100 text-slate-700",
                        isCurrentDay && !isSelected && "text-primary-600 font-extrabold bg-primary-50 ring-1 ring-primary-200"
                    )}
                >
                    {isCurrentDay && !isSelected && (
                        <span className="absolute -top-1 -right-1 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                        </span>
                    )}
                    {day}
                </button>
            );
        }
        return days;
    };

    return (
        <div className={cn(
            "bg-white rounded-3xl p-4 md:p-6 w-full max-w-sm mx-auto shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200",
            className
        )}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6 px-1">
                <button
                    onClick={(e) => { e.preventDefault(); handlePrevMonth(); }}
                    className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                >
                    <ChevronLeft size={20} className="stroke-[3]" />
                </button>

                <h3 className="text-lg font-black text-slate-800">
                    {MONTHS[viewDate.getMonth()]} <span className="text-primary-500">{viewDate.getFullYear()}</span>
                </h3>

                <button
                    onClick={(e) => { e.preventDefault(); handleNextMonth(); }}
                    className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                >
                    <ChevronRight size={20} className="stroke-[3]" />
                </button>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 mb-2 text-center">
                {DAYS.map(day => (
                    <div key={day} className="text-xs font-black text-slate-400 uppercase tracking-wider py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-y-1 justify-items-center">
                {renderDays()}
            </div>

            {/* Footer / Current Selection Info (Optional) */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center px-1">
                <button
                    onClick={(e) => { e.preventDefault(); onChange(new Date()); setViewDate(new Date()); }}
                    className="text-xs font-bold text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                    Jump to Today
                </button>
                <div className="text-xs font-medium text-slate-400">
                    {value.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
            </div>
        </div>
    );
}

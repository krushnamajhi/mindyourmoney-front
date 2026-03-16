import React from 'react';

interface StatusCircleProps {
    percentage: number;
    size?: number;
    strokeWidth?: number;
}

const DynamicStatusCircle: React.FC<StatusCircleProps> = ({
    percentage = 0,
    size = 192,
    strokeWidth = 8
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;

    // COLOR LOGIC ENGINE
    const getColorClass = (pct: number) => {
        if (pct > 80) return 'text-red-500';      // CRITICAL: Red
        if (pct < 50) return 'text-green-500';    // SAFE: Cyber Green
        return 'text-amber-500';                  // WARNING: Amber (50% - 80%)
    };

    const statusColor = getColorClass(percentage);

    return (
        <div className="flex flex-col items-center justify-center py-8 relative">
            <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>

                <svg className="absolute top-0 left-0 transform -rotate-90" width={size} height={size}>
                    {/* Background Track */}
                    <circle
                        className="text-slate-100"
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        r={radius}
                        cx={size / 2}
                        cy={size / 2}
                    />
                    {/* Progress Path with Dynamic Color */}
                    <circle
                        className={`${statusColor} transition-all duration-700 ease-in-out`}
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        style={{ strokeDashoffset: offset }}
                        strokeLinecap="round"
                        fill="transparent"
                        r={radius}
                        cx={size / 2}
                        cy={size / 2}
                    />
                </svg>

                <div className="text-center z-10">
                    {/* Percentage text also reflects the status color */}
                    <h4 className={`text-3xl font-bold transition-colors duration-700 ${statusColor}`}>
                        {Math.round(percentage)}%
                    </h4>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Spent</p>
                </div>
            </div>
        </div>
    );
};

export default DynamicStatusCircle;
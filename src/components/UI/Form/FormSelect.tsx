import { Controller } from "react-hook-form";
import { BaseSelect } from "../BaseSelect";

export default function FormSelect({ data }: { data: any }) {
    const { label, viewMode, control, name, options, dataType = 'string', value: manualValue, ...props } = data;
    const isViewMode = viewMode === true;

    // Ensure all options have string values for processing
    const normalizedOptions = options?.map((opt: any) => ({
        ...opt,
        value: String(opt.value)
    })) || [];

    const renderLabelFromValue = (val: any) => {
        const option = normalizedOptions.find((opt: any) => opt.value === String(val));
        return option ? option.label : <span className="text-slate-400 italic">No Selection</span>;
    };

    const renderHeader = () => (
        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest px-1">
            {label}
        </label>
    );

    if (isViewMode) {
        return (
            <div className="space-y-3">
                {renderHeader()}
                <div className="w-full px-5 text-slate-800 font-bold min-h-[50px] flex items-center">
                    {control ? (
                        <Controller
                            name={name}
                            control={control}
                            render={({ field }) => <>{renderLabelFromValue(field.value)}</>}
                        />
                    ) : (
                        renderLabelFromValue(manualValue)
                    )}
                </div>
            </div>
        );
    }

    if (!control) {
        return (
            <div className="space-y-3">
                {renderHeader()}
                <BaseSelect
                    value={manualValue !== undefined && manualValue !== null ? String(manualValue) : ''}
                    onChange={(val) => {
                        const formattedValue = dataType === 'number' ? (val === '' ? null : Number(val)) : val;
                        props.onChange?.(formattedValue);
                    }}
                    options={normalizedOptions}
                    placeholder={props.placeholder}
                />
            </div>
        );
    }

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <div className="space-y-3">
                    {renderHeader()}
                    <BaseSelect
                        value={field.value !== undefined && field.value !== null ? String(field.value) : ''}
                        onChange={(val) => {
                            const formattedValue = dataType === 'number' ? (val === '' ? null : Number(val)) : val;
                            field.onChange(formattedValue);
                        }}
                        options={normalizedOptions}
                        placeholder={props.placeholder}
                    />
                </div>
            )}
        />
    );
}
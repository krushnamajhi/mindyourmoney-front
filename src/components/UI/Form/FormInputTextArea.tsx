export default function FormInputTextArea({ data }: { data: any }) {
    const { label, viewMode, ...props } = data;
    const isViewMode = viewMode === true;

    return (
        <div className="space-y-2">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest px-1">{label}</label>
            {isViewMode ? (
                <div className="w-full px-5 text-slate-800 font-bold min-h-[50px] flex items-center">
                    {props.value || <span className="text-slate-400 italic">No data</span>}
                </div>
            ) : (
                <textarea
                    {...props}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 font-medium placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500/30 transition-all resize-none shadow-inner"
                    placeholder={props.placeholder || "e.g., Summer Trip, Apartment 302"}
                />
            )}
        </div>
    );
}
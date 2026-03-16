
export default function FormHeader({ title, description }: { title: string, description: string }) {
    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-900">
                {title}
            </h1>
            <p className="text-sm text-slate-500">
                {description}
            </p>
        </div>
    )
}
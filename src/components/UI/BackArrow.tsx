import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function BackArrow({ navigation }: { navigation?: string }) {
    const navigate = useNavigate();
    console.log(navigation)
    return (
        <button
            onClick={() => navigation ? navigate(navigation) : navigate(-1)}
            className="p-2 -ml-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
        >
            <ArrowLeft size={20} />
        </button>
    )
}
import { useNavigate } from "react-router-dom"
import { ArrowLeft, MoreVertical } from "lucide-react"

function InvoiceHeader({ title, showMenu, onMenuClick }) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-sm">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-medium">{title}</h1>
      </div>
      {showMenu && (
        <button onClick={onMenuClick} className="p-2">
          <MoreVertical className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}

export default InvoiceHeader

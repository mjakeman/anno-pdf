import { XMarkIcon } from "@heroicons/react/20/solid"
import ReactDOM from "react-dom"

interface ModalProps {
    isVisible: boolean,
    onOutsideClick: (params: any) => any,
    children: React.ReactNode
}

export default function Modal({isVisible, onOutsideClick, children}: ModalProps) {
    if(!isVisible) return null

return ReactDOM.createPortal(
<div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center ">
    {isVisible && 
    <div className="bg-white rounded-lg z-[200] relative">
        {children}
        <span className="absolute top-2 right-2 hover:cursor-pointer">
            <XMarkIcon onClick={onOutsideClick} className="w-6 h-6 text-slate-500 dark:text-white"/>
        </span>
    </div>
    }
</div>
, document.getElementById("portal-destination")!
)
}
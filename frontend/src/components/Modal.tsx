import ReactDOM from "react-dom"

interface ModalProps {
    isVisible: boolean,
    onOutsideClick: (params: any) => any,
    children: React.ReactNode
}

export default function Modal({isVisible, onOutsideClick, children}: ModalProps) {
    if(!isVisible) return null

return ReactDOM.createPortal(
<div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
    {isVisible && 
    
    <div className="bg-white rounded-lg p-4 z-[200] relative">
        {children}
        <button onClick={onOutsideClick} className="absolute top-0 right-0 p-2">
            X
        </button>
    </div>
    }
</div>
, document.getElementById("portal-destination")!
)
}
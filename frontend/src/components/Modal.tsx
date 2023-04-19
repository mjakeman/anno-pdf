
interface ModalProps {
    isVisible: boolean,
    onOutsideClick: (params: any) => any,
    children: React.ReactNode
}

export default function Modal({isVisible, onOutsideClick, children}: ModalProps) {
return(
<div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
    <button onClick={()=>onOutsideClick}>
    Close
    </button>
    {isVisible && 
    <div className="bg-white rounded-lg p-4">
        {children}
    </div>
    }
</div>
)
}
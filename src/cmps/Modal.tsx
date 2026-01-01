type ModalCmp = {
    isOpen:boolean
    onClose: ()=>void
    children:HTMLElement
}

export const Modal=({isOpen,onClose,children}:ModalCmp)=>{
    
    return(
        <div className="modal-container">

        </div>
    )
}
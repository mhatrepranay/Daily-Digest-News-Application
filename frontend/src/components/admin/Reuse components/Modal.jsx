import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ onClose, children }) => {
    return ReactDOM.createPortal(
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
            <div className="bg-white rounded-lg p-4 z-50 w-1/3">
                {children}
            </div>
        </div>,
        document.getElementById('modal-root')
    );
};

export default Modal;

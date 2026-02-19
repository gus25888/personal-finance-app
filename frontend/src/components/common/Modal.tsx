import type { JSX } from "react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    children: JSX.Element;
};

const Modal = ({ isOpen, onClose, children }: Props): JSX.Element | null => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content" role="dialog">
                <button
                    aria-label="Close"
                    className="modal-close-button"
                    onClick={onClose}
                >
                    X
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;

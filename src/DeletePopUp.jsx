import React from "react";
import { createPortal } from "react-dom";

function DeletePopUp({ varClass, onDelFunc, onCancel }) {

    const handleCancel = () => {
        onCancel();
    }
    const handleConfirm = () => {
        onDelFunc();
        onCancel();
    }

    // Portal breaks the popup out of parent stacking contexts
    return createPortal(
        <div className={`delete-popup ${varClass}`}>
            <div className="delete-heading">
                <p>WARNING!</p>
            </div>
            <div className="delete-message">
                <p>This will delete this exercise permanently!</p>
                <div className="delete-buttons">
                    <button className="delete-confirm" onClick={handleConfirm}>CONFIRM</button>
                    <button className="delete-cancel" onClick={handleCancel}>CANCEL</button>
                </div>
            </div>
        </div>,
        document.body
    );
}
export default DeletePopUp;
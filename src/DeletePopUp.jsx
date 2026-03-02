import React from "react";

function DeletePopUp({ varClass, onDelFunc, onCancel }) {

    const handleCancel = () => {
        onCancel();
    }
    const handleConfirm = () => {
        onDelFunc();
        onCancel();
    }

    return (<div className={`delete-popup ${varClass}`}>
        <div className="delete-heading">
            <p>WARNING!</p>
        </div>
        <div className="delete-message">
            <p>This will delete this exercise permanently!</p>
            <button className="delete-confirm" onClick={handleConfirm}>CONFIRM</button>
            <button className="delete-cancel" onClick={handleCancel}>CANCEL</button>
        </div>
    </div>)
}
export default DeletePopUp;
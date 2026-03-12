import React from "react";

function ResetPopUp({ varClass, onConfirm, onCancel }) {

    const handleCancel = () => {
        onCancel();
    }
    const handleConfirm = () => {
        onConfirm();
        onCancel();
    }

    return (<div className={`delete-popup ${varClass}`}>
        <div className="delete-heading">
            <p>RESET PROGRESS!</p>
        </div>
        <div className="delete-message">
            <p>Are you sure you want to reset all progress for this day?</p>
            <div className="delete-buttons">
                <button className="delete-confirm" onClick={handleConfirm}>CONFIRM</button>
                <button className="delete-cancel" onClick={handleCancel}>CANCEL</button>
            </div>
        </div>
    </div>)
}
export default ResetPopUp;

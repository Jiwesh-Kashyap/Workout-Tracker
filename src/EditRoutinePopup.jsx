import React, { useState, useEffect } from "react";

function EditRoutinePopup({ oldName, oldMessage, onSave, onCancel }) {
    const [editNewName, setEditNewName] = useState(oldName);
    const [editNewMessage, setEditNewMessage] = useState(oldMessage);

    useEffect(() => {
        setEditNewName(oldName);
        setEditNewMessage(oldMessage);
    }, [oldName, oldMessage]);

    const handleSaveEdit = () => {
        onSave(editNewName, editNewMessage);
    };

    return (
        <div className="delete-popup show" onClick={(e) => e.stopPropagation()}>
            <div className="delete-heading edit-heading">
                <p>EDIT ROUTINE</p>
            </div>
            <div className="delete-message">
                <div className="edit-inputs">
                    <label>Name: <input type="text" value={editNewName} onChange={(e) => setEditNewName(e.target.value)} /></label>
                    <br/>
                    <label>Message: <input type="text" value={editNewMessage} onChange={(e) => setEditNewMessage(e.target.value)} /></label>
                </div>
                <div className="delete-buttons" style={{marginTop: "20px"}}>
                    <button className="delete-confirm edit-confirm" onClick={handleSaveEdit}>SAVE</button>
                    <button className="delete-cancel" onClick={onCancel}>CANCEL</button>
                </div>
            </div>
        </div>
    );
}

export default EditRoutinePopup;

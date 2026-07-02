import React, { useState } from 'react';
import Row from './Row';
import ResetPopUp from './ResetPopUp';
import { ReactSortable } from 'react-sortablejs';

function Output({ list, setList, onDelete, dayName, handleReset }) {
    const [showReset, setShowReset] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const [editSets, setEditSets] = useState("");
    const [editReps, setEditReps] = useState("");
    const [editWeight, setEditWeight] = useState("");

    const openEditModal = (item) => {
        setEditingItem(item);
        setEditSets(item.numOfSets);
        setEditReps(item.numOfReps);
        setEditWeight(item.weight);
    };

    const handleDelete = async (workoutName) => {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/tracker/${dayName}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ name: workoutName }),
        });
        if (response.ok) {
            onDelete(workoutName);
        }
        else {
            console.log("OUTPUT.jsx->Error while deleting exercise!");
        }
    }

    const handleEditSave = async () => {
        if (!editingItem) return;
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/tracker/${dayName}`, {
                method: 'PUT',
                body: JSON.stringify({ 
                    dayName, 
                    intent: "EDIT_WORKOUT",
                    name: editingItem.exerciseName,
                    numOfReps: editReps,
                    numOfSets: editSets,
                    weight: editWeight,
                }),
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}` 
                },
            });
            if (response.ok) {
                const data = await response.json();
                // Properly update React state instead of mutating the prop
                setList(prevList => prevList.map(item => 
                    item.exerciseName === editingItem.exerciseName 
                        ? { ...item, numOfReps: data.numOfReps, numOfSets: data.numOfSets, weight: data.weight } 
                        : item
                ));
                setEditingItem(null);
            }
        } catch (err) {
            console.log("Error while updating workout!", err);
        }
    };

    const handleEndState = async (freshList) => {
        const orderOfObjectIds = [];
        for(let i = 0; i<freshList.length; i++){
            orderOfObjectIds.push(freshList[i]._id);
        }

        try{
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/tracker/${dayName}`,{
            method:'PUT',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({intent:"SORT_WORKOUT", orderOfObjectIds: orderOfObjectIds})
        })
        if(response.ok){
            console.log('Sorting successfull!');
        }
        } catch(err){
        console.log('Error while sorting: ', err);
        }
    }

    return (<>
        {showReset && (
            <ResetPopUp
                varClass="show"
                onConfirm={() => handleReset()}
                onCancel={() => setShowReset(false)}
            />
        )}
        
        {/* LIFTED EDIT MODAL */}
        <div className={`delete-popup edit-form ${editingItem ? 'show' : ''}`}>
            <div className="delete-heading edit-heading">
                <p>EDIT EXERCISE</p>
            </div>
            <div className="delete-message">
                <div className="edit-inputs">
                    <label>Sets: <input type="number" value={editSets} onChange={(e) => setEditSets(e.target.value)} /></label>
                    <label>Reps: <input type="number" value={editReps} onChange={(e) => setEditReps(e.target.value)} /></label>
                    <label>Weight: <input type="number" value={editWeight} onChange={(e) => setEditWeight(e.target.value)} /></label>
                </div>
                <div className="delete-buttons">
                    <button className="delete-confirm edit-confirm" onClick={handleEditSave}>SAVE</button>
                    <button className="delete-cancel" onClick={() => setEditingItem(null)}>CANCEL</button>
                </div>
            </div>
        </div>

        <div id="output">
            <button className='output-reset' onClick={() => setShowReset(true)}>
                Reset Progress
            </button>
            <h1>THE PLAN</h1>
            <br />
            <table>
                <caption className='table-name'>PLAN 1</caption>
                <thead>
                    <tr id='table-header'>
                        <th className='serial'>#</th>
                        <th className='name-table'>Name</th>
                        <th className='sets-table'>Sets</th>
                        <th className='reps-table'>Reps</th>
                        <th className='weights-table'>Weight Used</th>
                    </tr>
                </thead>

                <ReactSortable tag="tbody" 
                    list={list} 
                    setList={(newList) => {
                        setList(newList);
                        handleEndState(newList);
                    }}
                    delayOnTouchOnly={true}
                    delay={250}
                    handle=".drag-handle"
                    animation={150}
                    ghostClass= 'blue-background-class'
                    swapThreshold={0.8}
                    >
                    {list.map((item, i) => (
                        <Row key={item._id} item={item} index={i} handleDelete={handleDelete} dayName={dayName} onEditClick={() => openEditModal(item)} />
                    ))}
                </ReactSortable>

                <tfoot>
                    {/* <tr id='end'>END</tr> */}
                </tfoot>
            </table>
        </div>
    </>);
}
export default Output;
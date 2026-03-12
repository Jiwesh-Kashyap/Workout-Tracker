import React, { useState, useEffect} from "react";
import DoneImage from "./DoneImage";
import DeleteImage from "./DeleteImage";
import Checker from "./Checker";
import editImage from './assets/editImage.png';
import { ResetContext } from "./ResetContext";

function Row({ item, index, handleDelete, dayName }) {
    const [isCompleted, setIsCompleted] = useState(item.completed || false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [edit, setEdit] = useState(false);
    const [numOfSets, setNumOfSets] = useState(item.numOfSets);
    const [numOfReps, setNumOfReps] = useState(item.numOfReps);
    const [weight, setWeight] = useState(item.weight);

    useEffect(() => {
        setIsCompleted(item.completed || false);
    }, [item]);



    const deleteClass = (isDeleted ? 'delete hide' : 'delete');
    const doneClass = (isCompleted ? 'done hide' : 'done');
    const checkerClass = (isCompleted ? 'checker-list hide' : 'checker-list');

    const  handleComplete = async () => {
        try{
            const response = await fetch(`http://localhost:4000/tracker/${dayName}`, {
                method: 'PUT',
                body: JSON.stringify({name: item.exerciseName, intent: "COMPLETE_WORKOUT"}),
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                intent: "COMPLETE_WORKOUT"
            })
            if(response.ok){
                console.log('Row updated successfully!');
            }
            const { workout } = await response.json();
            setIsCompleted(workout.completed);
        }
        catch(err){
            console.log('Error while updating row!', err);
        }
    }
    function onDelete(workoutName) {
        handleDelete(workoutName);
        setIsDeleted(true);
    }

    const editFormClass = `delete-popup edit-form ${edit ? 'show': ''}`;

    const handleEdit = async () => {

        try{
            const response = await fetch(`http://localhost:4000/tracker/${dayName}`, {
                method: 'PUT',
                credentials: 'include',
                body: JSON.stringify({ 
                    dayName, 
                    intent: "EDIT_WORKOUT",
                    name: item.exerciseName,
                    numOfReps: numOfReps,
                    numOfSets: numOfSets,
                    weight: weight,
                }),
                headers: {"Content-Type": "application/json"},
            })
            if(response.ok){
                console.log("Workout updated successfully!");
                const data = await response.json();
                item.numOfReps = data.numOfReps;
                item.numOfSets = data.numOfSets;
                item.weight = data.weight;
                setEdit(false);
            }
        }
        catch(err){
            console.log("Error while updating workout!", err);
        }
    }
 
    const finalClassName = `rows ${isCompleted ? 'row-completed' : ''} ${isDeleted? 'deleted': ''}`;

    return (
        <tr className={finalClassName}>
            <td className='serial'>{index + 1}</td>
            <td className='name-table'>{item.exerciseName}</td>
            <td className='sets-table'>{item.numOfSets}</td>
            <td className='reps-table'>{item.numOfReps}</td>
            <td className='weights-table'>{item.weight}</td>
            <td id="line-div-action-cell" className="hide-hr separator-cell"></td>
            {/* We pass the handleComplete function down */}
            <td className='action-cell'>
                <DoneImage className={doneClass} onCheckFunc={handleComplete} />
                <DeleteImage className={deleteClass} onDelFunc={()=>onDelete(item.exerciseName)}/>
                <img className="edit-row" src={editImage} onClick={() => setEdit(true)} style={{cursor: "pointer"}}></img>
                <Checker className={checkerClass} sets={item.numOfSets} onComplete={handleComplete}/>

                <div className={editFormClass}>
                    <div className="delete-heading edit-heading">
                        <p>EDIT EXERCISE</p>
                    </div>
                    <div className="delete-message">
                        <div className="edit-inputs">
                            <label>Sets: <input type="number" value={numOfSets} onChange={(e) => setNumOfSets(e.target.value)} /></label>
                            <label>Reps: <input type="number" value={numOfReps} onChange={(e) => setNumOfReps(e.target.value)} /></label>
                            <label>Weight: <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} /></label>
                        </div>
                        <div className="delete-buttons">
                            <button className="delete-confirm edit-confirm" onClick={handleEdit}>SAVE</button>
                            <button className="delete-cancel" onClick={() => setEdit(false)}>CANCEL</button>
                        </div>
                    </div>
                </div>
            </td>
        </tr>
    );
}
export default Row
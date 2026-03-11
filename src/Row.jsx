import React, { useState } from "react";
import DoneImage from "./DoneImage";
import DeleteImage from "./DeleteImage";
import Checker from "./Checker";

function Row({ item, index, handleDelete, dayName }) {
    const [isCompleted, setIsCompleted] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);

    const deleteClass = (isDeleted ? 'delete hide' : 'delete');
    const doneClass = (isCompleted ? 'done hide' : 'done');
    const checkerClass = (isCompleted ? 'checker-list hide' : 'checker-list');

    const  handleComplete = async () => {
        try{
            const response = await fetch(`http://localhost:4000/tracker/${dayName}`, {
                method: 'PUT',
                body: JSON.stringify({name: item.exerciseName}),
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
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
    const finalClassName = `rows ${isCompleted ? 'completed' : ''} ${isDeleted? 'deleted': ''}`;

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
                <Checker className={checkerClass} sets={item.numOfSets} onComplete={handleComplete} />
            </td>
        </tr>
    );
}
export default Row
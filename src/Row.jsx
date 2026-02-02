import React, { useState } from "react";
import DoneImage from "./DoneImage";
import DeleteImage from "./DeleteImage";
import Checker from "./Checker";

function Row({ item, index }) {
    const [isCompleted, setIsCompleted] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);

    const deleteClass = (isDeleted ? 'delete hide' : 'delete');
    const doneClass = (isCompleted ? 'done hide' : 'done');
    const checkerClass = (isCompleted ? 'checker-list hide' : 'checker-list');

    function handleComplete() {
        setIsCompleted(true);
    }
    function handleDelete(){
        setIsDeleted(true);
    }

    return (
        <tr className={`rows ${isCompleted ? 'hide' : ''}`}>
            <td className='serial'>{index + 1}</td>
            <td className='name-table'>{item.exerciseName}</td>
            <td className='sets-table'>{item.numOfSets}</td>
            <td className='reps-table'>{item.numOfReps}</td>
            <td className='weights-table'>{item.weight}</td>
            <td id="line-div-action-cell" className="hide-hr separator-cell"></td>
            {/* We pass the handleComplete function down */}
            <td className='action-cell'>
                <DoneImage className={doneClass} onCheckFunc={handleComplete} />
                <DeleteImage className={deleteClass} onDelFunc={handleDelete}/>
                <Checker className={checkerClass} sets={item.numOfSets} onComplete={handleComplete} />
            </td>
        </tr>
    );
}
export default Row
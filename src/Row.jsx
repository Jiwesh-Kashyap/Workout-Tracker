import React, { useState } from "react";
import DoneImage from "./DoneImage";
import DeleteImage from "./DeleteImage";
import Checker from "./Checker";

function Row({item, index}){
    const [isCompleted, setIsCompleted] = useState(false);

    const deleteClass = (isCompleted?'delete hide':'delete');
    const doneClass = (isCompleted?'done hide':'done');
    const checkerClass = (isCompleted?'checker-list hide':'checker-list');

    function handleComplete(){
        setIsCompleted(true);
    }

    return (
        <tr className={`rows ${isCompleted?'hide':''}`}>
            <div className="rows-essential">
                <td className='serial'>{index + 1}</td>
                <td className='name-table'>{item.exercise}</td>
                <td className='sets-table'>{item.sets}</td>
                <td className='reps-table'>{item.reps}</td>
                <td className='weights-table'>{item.weights}</td>
            </div>
            <hr id="line-div-action-cell" className="hide-hr"/>      
            {/* We pass the handleComplete function down */}
            <td className='action-cell'> 
                 <DoneImage className={doneClass} onCheckFunc={handleComplete} />
                 <DeleteImage className={deleteClass} />
                 <Checker className={checkerClass} sets={item.sets} onComplete={handleComplete}/>
            </td>
        </tr>
    );
}
export default Row
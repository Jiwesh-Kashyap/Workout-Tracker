import React, { useState } from 'react';
import Row from './Row';
import ResetPopUp from './ResetPopUp';
import { ReactSortable } from 'react-sortablejs';

function Output({ list, setList, onDelete, dayName, handleReset }) {
    const [showReset, setShowReset] = useState(false);

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
            //a pop up of successfully deletion
            onDelete(workoutName);
        }
        else {
            console.log("OUTPUT.jsx->Error while deleting exercise!");
        }
    }

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
                    }}>
                    {list.map((item, i) => (
                        <Row key={item._id} item={item} index={i} handleDelete={handleDelete} dayName={dayName} />
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
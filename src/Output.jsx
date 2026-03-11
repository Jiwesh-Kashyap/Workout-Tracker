import React from 'react';
import Row from './Row';

function Output({list, onDelete, dayName}){
    const handleDelete = async (workoutName) => {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/tracker/${dayName}`, {
            method: "DELETE",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: workoutName }),
        });
        if(response.ok){
            //a pop up of successfully deletion
            onDelete(workoutName);
        }
        else{
            console.log("OUTPUT.jsx->Error while deleting exercise!");
        }
    }
    return(<>
        <div id = "output">
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

                <tbody>
                    {list.map((item,i)=> (
                        <Row key = {item._id} item={item} index = {i} handleDelete={handleDelete} dayName = {dayName}/>
                    ))}
                </tbody>

                <tfoot>
                    {/* <tr id='end'>END</tr> */}
                </tfoot>
            </table>
        </div>
    </>);
}
export default Output;
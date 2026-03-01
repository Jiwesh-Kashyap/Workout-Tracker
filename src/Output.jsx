import React from 'react';
import Row from './Row';

function Output({list}){
    // const [isFocused, setIsFocused] = useState(0);
    // const [isComplete, setIsComplete] = useState(false);
    // const handleComplete = (isComplete) => {

    // }
    const handleDelete = async ()=>{
        const response = await fetch('http://localhost:4000/api/workouts',{
            method: "DELETE",
        });
        if(response.ok){
            //a pop up of successfull deletion
            console.log('Successfully Deleted the exercise!');
        }
        else{
            console.log("Error while deleting exercise!");
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
                        <Row key = {i} item={item} index = {i} handleDelete={handleDelete}/>
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
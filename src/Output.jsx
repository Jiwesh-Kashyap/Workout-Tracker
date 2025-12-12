import React, {useState, useRef, useEffect} from 'react';
import DoneImage from './DoneImage';
import DeleteImage from './DeleteImage';
import Checker from './Checker';

function Output({list}){
    // const [isFocused, setIsFocused] = useState(0);
    let deleteImageClass = 'delete';
    let doneImageClass = 'done';
    let checkerClass = 'checker-list';
    
    function handleCompletedSets(isChecked){
        if(isChecked){
            deleteImageClass = 'delete hide';
            doneImageClass = 'done hide';
            checkerClass = 'checker-list hide';
        }
    }

    const displayTable =
    list.map((item,i) => 
        <tr className='rows' key={i}>
            <td className='serial'>{i + 1}</td>
            <td className='name-table'>{item.exercise}</td>
            <td className='sets-table'>{item.sets}</td>
            <td className='reps-table'>{item.reps}</td>
            <td className='weights-table'>{item.weights}</td>
            <DoneImage className={doneImageClass} onCheckFunc={handleCompletedSets}/>
            <DeleteImage className={deleteImageClass}/>
            <Checker className={checkerClass} sets={item.sets}/>
        </tr>
    );

    return(<>
        <div id = "output">
            <h1>THE PLAN</h1>
            <br />
            <table>
                <caption className='table-name'>PLAN 1</caption>
                <thead>
                    <tr className='rows'>
                        <th className='serial'>#</th>
                        <th className='name-table'>Name</th>
                        <th className='sets-table'>Sets</th>
                        <th className='reps-table'>Reps</th>
                        <th className='weights-table'>Weight Used</th>
                        
                    </tr>
                </thead>
                <tbody>
                    {displayTable}
                </tbody>
                <tfoot>
                    {/* <tr id='end'>END</tr> */}
                </tfoot>
            </table>
        </div>
    </>);
}
export default Output;
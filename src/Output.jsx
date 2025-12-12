import React, {useState, useRef, useEffect} from 'react';
import DoneImage from './DoneImage';
import DeleteImage from './DeleteImage';
import Checker from './Checker';
import Row from './Row';

function Output({list}){
    // const [isFocused, setIsFocused] = useState(0);
    
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
                        <Row key = {i} item={item} index = {i} />
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
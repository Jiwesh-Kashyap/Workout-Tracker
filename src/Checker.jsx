import React from 'react';
import CustomCheckBox from './CustomCheckBox';

function Checker({sets}){
    const list = [];
    for(let i=0; i<sets; i++){
        list.push(i);
    }
    const listMap = list.map((i) => 
        <li key={i}><CustomCheckBox/>{i+1}</li>
    );
    return(
        <ul className='checker-list'>{listMap}</ul>
    );
}
export default Checker;
import React, { useState } from 'react';
import CustomCheckBox from './CustomCheckBox';
// import motion from 'motion/react';

function Checker({sets,className}){
    
    const list = [];
    for(let i=0; i<sets; i++){
        list.push(i);
    }

    let i = 0;
    function isValidCheck(ind){
        if(i==ind) {
            i++;
            return true;
        }
        else return false;
    }

    const listMap = list.map((i) => 
        <li key={i}><CustomCheckBox ind = {i} func = {isValidCheck}/>{i+1}</li>
    );
    return(
        <ul className={className}>{listMap}</ul>
    );
}
export default Checker;
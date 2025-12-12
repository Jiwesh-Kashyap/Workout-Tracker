import React, { useState } from 'react';
import doneImg from './assets/done.png';

function DoneImage({onCheckFunc, className}) {   //prop should be some function
    const [isChecked, setIsChecked] = useState(false);
    const [display, setDisplay] = useState(false);

    function toggleDisplay(){
        setDisplay(!display);
    }
    function handleClick(){
        setIsChecked(true);
        onCheckFunc(isChecked);
    }
  return (
    <div style={{position:'relative',display: 'inline-block' }}>
        <img src={doneImg} onMouseEnter={toggleDisplay}
            onMouseLeave={toggleDisplay} onClick={handleClick}
            className={className} alt="done" width="20"/>
        <div className={`completed ${display?'active':''}`}><p>mark as completed</p></div>
    </div>
  );
}
export default DoneImage
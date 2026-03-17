import React, { useState } from 'react';
import editImage from './assets/editImage.png';

function EditImage({ onClickFunc, className }) {
    const [display, setDisplay] = useState(false);

    function toggleDisplay() {
        setDisplay(!display);
    }
    
    function handleClick() {
        if(onClickFunc) onClickFunc();
    }
    
    return (
        <div className='div-done-img'>
            <img 
                src={editImage} 
                onMouseEnter={toggleDisplay}
                onMouseLeave={toggleDisplay} 
                onClick={handleClick}
                className={className} 
                alt="edit" 
                style={{cursor: "pointer"}}
                width="20"
            />
            <div className={`completed ${display ? 'active' : ''}`}>
                <p>edit exercise</p>
            </div>
        </div>
    );
}

export default EditImage;

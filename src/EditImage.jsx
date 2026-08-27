import React, { useState } from 'react';
import editImage from './assets/editImage.png';
import { SquarePen } from 'lucide-react';

function EditImage({ onClickFunc, className }) {
    const [display, setDisplay] = useState(false);

    function toggleDisplay() {
        setDisplay(!display);
    }
    
    function handleClick(e) {
        if(onClickFunc) onClickFunc(e);
    }
    
    return (
        <div className='div-edit-img'>
            <SquarePen 
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

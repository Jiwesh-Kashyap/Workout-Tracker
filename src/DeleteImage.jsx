import React,{useState} from 'react';
import deleteImg from './assets/delete.png';
import DeletePopUp from './DeletePopUp';
import {Trash} from 'lucide-react';

function DeleteImage({className, onDelFunc, type = "exercise"}) {
    const [display, setDisplay] = useState(false);
    const [popupDisplay,setPopupDisplay] = useState(false);

    function toggleDisplay(){
        setDisplay(!display);
    }
    function handleClick(){
        setPopupDisplay(true);
    }

    function closePopup() {
        setPopupDisplay(false);
    }


    return (
        <div className='div-delete-img'>
            <Trash
                className={className}
                alt="delete-button"
                width="20"
                onMouseEnter={toggleDisplay}
                onMouseLeave={toggleDisplay}
                onClick={handleClick} 
            />
            <div className={`completed ${display ? 'active' : ''}`}><p>delete {type}</p></div>
            <DeletePopUp varClass={`${popupDisplay ? 'show' : ''}`} onDelFunc={onDelFunc} onCancel={closePopup} type={type} />
        </div>

    );
}
export default DeleteImage
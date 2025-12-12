import React,{useState} from 'react';
import deleteImg from './assets/delete.png';

function DeleteImage({className}) {
    const [display, setDisplay] = useState(false);
    const [click, setClick] = useState(false);

    function toggleDisplay(){
        setDisplay(!display);
    }
    function handleClick(){
        // setClick(true);
    }

  return (
    <div className='div-done-img'>
        <img src={deleteImg}
        className={className} 
        alt="delete-button" 
        width="20"
        onMouseEnter={toggleDisplay}
        onMouseLeave={toggleDisplay} 
        onClick={handleClick} />
        <div className={`completed ${display?'active':''}`}><p>delete exercise</p></div>
    </div>
    
  );
}
export default DeleteImage
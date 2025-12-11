import React, { useState } from 'react';

function CustomCheckBox(){
    const [check, setCheck] = useState(false);
    
    function toggleCheck(){
        setCheck(!check);
    }
    return(<>
        <div className={(check)?"my-checkbox checked":"my-checkbox"}
            onClick={toggleCheck}
            role='checkbox'
            aria-checked={check}
            tabIndex="0"
            >
                {check?"✓" : " "}
        </div>
    </>);
}
export default CustomCheckBox;
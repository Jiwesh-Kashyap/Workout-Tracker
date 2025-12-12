import React, { useState } from 'react';

function CustomCheckBox({ind,func}){
    const [check, setCheck] = useState(false);
    const[isShaking, setIsShaking] = useState(false);
    
    function toggleCheck(i){
        if(func(i)) setCheck(!check);
        else{
            setIsShaking(true);

            setTimeout(() => {
                setIsShaking(false);                
            }, 500);

            // clearTimeout(timeoutId);
        }
    }

    const finalClassName = `my-checkbox ${(check)?`checked`:``} ${(isShaking)?`shaking`:``}`;

    return(<>
        <div className={finalClassName}
            onClick={() => toggleCheck(ind)}
            onKeyDown={(e) => { // makes accessible to keyboard users
                if (e.key === "Enter" || e.key === " ") {
                    toggleCheck(ind); 
                }
            }}
            role='checkbox'
            aria-checked={check}
            tabIndex="0"
            >
                {check?"✓" : " "}
        </div>
    </>);
}
export default CustomCheckBox;
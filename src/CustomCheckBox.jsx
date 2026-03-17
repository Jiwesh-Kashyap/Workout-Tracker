import React, { useState } from 'react';

function CustomCheckBox({ind, func, checked}){
    const[isShaking, setIsShaking] = useState(false);
    
    function toggleCheck(i){
        if(func(i)) {
            // Parent state 'cnt' updates, which will automatically re-render us with checked=true
        }
        else{
            setIsShaking(true);

            setTimeout(() => {
                setIsShaking(false);                
            }, 500);

            // clearTimeout(timeoutId);
        }
    }

    const finalClassName = `my-checkbox ${(checked)?`checked`:``} ${(isShaking)?`shaking`:``} work-sans-checker`;

    return(<>
        <div className={finalClassName}
            onClick={() => toggleCheck(ind)}
            onKeyDown={(e) => { // makes accessible to keyboard users
                if (e.key === "Enter" || e.key === " ") {
                    toggleCheck(ind); 
                }
            }}
            role='checkbox'
            aria-checked={checked}
            tabIndex="0"
            >
                {checked?"✓" : ind+1}
        </div>
    </>);
}
export default CustomCheckBox;
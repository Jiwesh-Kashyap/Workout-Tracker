import React, {useState, useContext, useEffect} from 'react';
import CustomCheckBox from './CustomCheckBox';
import { ResetContext } from './ResetContext';

function Checker({sets, className, onComplete}){
    
    const [cnt, setCnt] = useState(0);
    const { globalReset, setGlobalReset } = useContext(ResetContext);

    useEffect(() => {
        if(globalReset) {
            setCnt(0);
            setGlobalReset(false);
        }
    }, [globalReset, setGlobalReset])
     
    const list = [];
    for(let i=0; i<sets; i++){
        list.push(i);
    }

    function isValidCheck(ind){
        if(cnt==sets){
            onComplete();
            return;
        }
        if(cnt==ind) {
            setCnt(c=>c+1);
            if(cnt==sets-1){
                onComplete();
            }
            return true;
        }
        else return false;
    }

    const listMap = list.map((i) => 
        <li key={i}><CustomCheckBox ind={i} func={isValidCheck} checked={cnt > i} /></li>
    );
    return(
        <ul className={className}>{listMap}</ul>
    );
}
export default Checker;
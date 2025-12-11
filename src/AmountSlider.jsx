import React,{useState, useRef} from "react";
import Button from "./Button";

function AmountSlider({sliderVal, setSliderVal}){
    const interval = useRef(null);

    function handleChange(e){
        setSliderVal(Number(e.target.value));
    }
    const startAdding = () => {
        stopChange();   //clear interval
        setSliderVal(c => Number(c)+0.5);

        interval.current = setInterval(() => {
            setSliderVal(c => Number(c)+0.5);
        }, 100);
    };
    const startReducing = () => {
        stopChange();   //clear interval

        interval.current = setInterval(() => {
            setSliderVal(sliderVal => {
                const numVal = Number(sliderVal);
                if(numVal>0.5) return numVal-0.5;
                else {
                    stopChange();
                    return numVal;
                }
            })
        }, 100)
    };
    const stopChange = () => {
        if(interval.current){
            clearInterval(interval.current);
            interval.current = null;
        }
    };

    return(
    <div className="amount-slider active">
        <label htmlFor="is-weighted">Amount-&gt; {sliderVal} Kgs</label>

            {/* REDUCE */}
        <Button name = "-" id="reduce-button" 
            onMouseUp={stopChange} onMouseDown={startReducing}/>

        <input id = "slider" type="range" min={0.5} value={sliderVal} max={150} step={0.5}
            onChange= {handleChange}/>

            {/* ADD */}
        <Button name = "+" id="add-button"
            onMouseUp={stopChange} onMouseDown={startAdding}/>
        
    </div>);
}
export default AmountSlider;
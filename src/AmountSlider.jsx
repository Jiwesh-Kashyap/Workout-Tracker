import React,{useState, useRef} from "react";
import upImg from './assets/chevron-double-up_7482912.svg';
import downImg from './assets/chevron-double-down_7482911.svg';

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
        <label id="is-weighted">
            <label htmlFor="is-weighted" id="weight-label">Amount-&gt;{sliderVal}</label>
            <label htmlFor="is-weighted-unit" id="weight-unit">Kgs</label>
        </label>

            {/* REDUCE */}
        <div className="amount-slider-controls">
        <button id="reduce-button" 
            onMouseUp={stopChange} onMouseDown={startReducing}>
                <img src={downImg} alt="reduce weight"  className="control-weight"/>
            </button>

        <input id = "slider" type="range" min={0.5} value={sliderVal} max={150} step={0.5}
            onChange= {handleChange}/>

            {/* ADD */}
        <button id="add-button"
            onMouseUp={stopChange} onMouseDown={startAdding}>
                <img src={upImg} alt="increase weight" className="control-weight"/>
            </button>
        </div>
    </div>);
}
export default AmountSlider;
import React, {useState, useRef, useEffect} from 'react';
import AmountSlider from './AmountSlider';
import Button from './Button';

function Input({onAddExercise}){
    const [fraction, setFraction] = useState(0);    //to display the percentage done

    const [exercise, setExercise] = useState("");
    const [sets, setSets] = useState("");
    const [reps, setReps] = useState("");
    const [weights, setWeights] = useState(50);
    
    const onEnter = () => {
        if(!exercise || !sets || !reps){
            window.alert("Empty Input");
            return;
        }
        const tableRow = {exercise,sets,reps, weights};
        onAddExercise(tableRow);
        setExercise("");
        setSets("");
        setReps("");
        setWeights(50);
    }
    function handleRadio(e){
        const amountSlider = document.querySelector('.amount-slider');
        if(e.target.id==="weighted"){
            amountSlider.classList.add('active');
        }
        else if(e.target.id==="body-weight"){
            amountSlider.classList.remove('active');
        }
    }

    return(<>
        <div id = "input">
        {/* Name */}
            <label htmlFor="name">
                <h3 className = 'josefin-sans-label'>Name of exercise: </h3>
            </label>
            <input type="text" id="name" value={exercise} className='input-box' onChange={(e) => setExercise(e.target.value)}/>

        {/* Sets */}
            <label htmlFor="sets">
                <h3 className = 'josefin-sans-label'>Num of Sets: </h3>
            </label>
            <input type="text" id="sets" value = {sets} className='input-box' onChange={(e) => setSets(e.target.value)}/>

        {/* Reps */}
            <label htmlFor="reps">
                <h3 className = 'josefin-sans-label'>Num of reps: </h3>
            </label>
            <input type="text" id="reps" value = {reps} className='input-box' onChange={(e) => setReps(e.target.value)}/>

        {/* Enter */}
        <button className='enter-button' onClick={onEnter}>ENTER</button>

        {/* Weights */}
            <label htmlFor="weights">
                <h3 className='josefin-sans-label'>Weight Used: </h3>
            </label>
            <div id='label-of-weight'>
                <input type="radio" id="weighted" 
                    onClick={handleRadio} name='weights' className='input-box' defaultChecked/>
                <label htmlFor="weighted" >Weighted</label>

                <input type="radio" id = "body-weight" 
                 onClick={handleRadio} name='weights' className='input-box' />
                <label htmlFor="body-weight">Body weight</label>
            </div>
            <br />
            <AmountSlider sliderVal = {weights} setSliderVal={setWeights}/>
            {/* <div id='name-of-exercise'></div> */}
        </div>
    </>);
}
export default Input;
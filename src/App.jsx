import React, { useState } from 'react';
import Header from './Header'
import Input from './Input';
import Output from './Output';

function App() {
    const[exercise, setExercise] = useState([]);

    function addExercise(tableRow){
        setExercise(current => [...current, tableRow]);
    }
    return (
    <>
      <Header/>
        <svg
        width="100%"
        height="20"
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        >
        <path
            d="M 0 5 C 25 0, 75 0, 100 5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
        />
        </svg>
      <div id = "layout">
        <Input onAddExercise = {addExercise}/>
        <hr id = "divider"/>
        <Output list = {exercise}/>
      </div>
      
    </>
  )
}

export default App
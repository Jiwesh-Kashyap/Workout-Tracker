import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Lenis from 'lenis';
import Input from './Input';
import Output from './Output';
import Footer from './Footer';
import { ResetContext } from './ResetContext';

function Tracker() {
    const [plan, setPlan] = useState([]);
    const [globalReset, setGlobalReset] = useState(false);
    const { dayName } = useParams();

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/tracker/${dayName}`, {
                    credentials: 'include'
                });
                if (response.ok) {
                    const json = await response.json();
                    setPlan(json);
                }
            } catch (error) {
                console.error("Failed to fetch workouts:", error);
            }
        };

        fetchWorkouts();

        const lenis = new Lenis({
            duration: 0.7,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        // Start the loop
        requestAnimationFrame(raf);

        // Cleanup: Destroy the instance if the component unmounts
        return () => {
            lenis.destroy();
        };
    }, []);

    async function addExercise(tableRow) {
        const workoutData = {
            exerciseName: tableRow.exerciseName,
            numOfSets: parseInt(tableRow.sets),
            numOfReps: parseInt(tableRow.reps),
            weight: (tableRow.weights === "Body Weight" || tableRow.weights === "NULL") ? 0 : Number(tableRow.weights)
        };

        try {
            console.log("Sending POST to backend:", workoutData);
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/tracker/${dayName}`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(workoutData), 
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const json = await response.json();

            if (response.ok) {
                console.log("Backend save success:", json);
                setPlan(current => [...current, json]);
            } else {
                console.error("Failed to add workout (backend error):", json);
            }
        } catch (error) {
            console.error("Network or Fetch Error:", error);
        }
    }
    function deleteExercise(workoutName){
        setPlan(c => c.filter((row) => row.exerciseName!==workoutName));
    }
    
    const handleReset = async () => {
        try{
            const response = await fetch(`https://workout-tracker-y064.onrender.com/tracker/${dayName}`, {
                method: 'PATCH',
                body: JSON.stringify({dayName}),
                credentials: 'include',
                headers: {'Content-Type':'application/json'},
            });
            if(response.ok){
                console.log('Successfully resetted the progress!');
            }
            const workouts = await response.json();
            setPlan(workouts);
            setGlobalReset(true);
        }
        catch(err){
            console.log('Error in resetting progress! ', err);
        }
    }

    return (
        <ResetContext.Provider value = {{globalReset, setGlobalReset}}>
            <Header dayName={dayName}/>
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
                    strokeWidth="2"
                />
            </svg>
            <div id="layout">
                <Input onAddExercise={addExercise} />
                <hr id="divider" />
                <Output list={plan} dayName={dayName} handleReset={handleReset} onDelete={(workoutName) => deleteExercise(workoutName)}/>
            </div>
            <Footer />
        </ResetContext.Provider>
    )
}

export default Tracker

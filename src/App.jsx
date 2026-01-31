import React, { useState, useEffect } from 'react';
import Header from './Header';
import Lenis from 'lenis';
import Input from './Input';
import Output from './Output';
import Footer from './Footer';

function App() {
    const [exercise, setExercise] = useState([]);

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/workouts');
                if (response.ok) {
                    const json = await response.json();
                    setExercise(json);
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
            const response = await fetch('http://localhost:4000/api/workouts', {
                method: 'POST',
                body: JSON.stringify(workoutData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const json = await response.json();

            if (response.ok) {
                console.log("Backend save success:", json);
                setExercise(current => [...current, json]);
            } else {
                console.error("Failed to add workout (backend error):", json);
            }
        } catch (error) {
            console.error("Network or Fetch Error:", error);
        }
    }
    return (
        <>
            <Header />
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
                <Output list={exercise} />
            </div>
            <Footer />
        </>
    )
}

export default App
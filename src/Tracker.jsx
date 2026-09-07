import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Lenis from 'lenis';
import Input from './Input';
import Output from './Output';
import Footer from './Footer';
import { ResetContext } from './ResetContext';
import { Plus, X } from 'lucide-react';

function Tracker() {
    const [plan, setPlan] = useState([]);
    const [globalReset, setGlobalReset] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { dayName } = useParams();

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/tracker/${dayName}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
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

    useEffect(() => {
        const handleFinishWorkout = async (e) => {
            const { updateTemplate } = e.detail;
            
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reports/finish`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        exercises: plan, 
                        updateTemplate: updateTemplate
                    })
                });
                
                if (response.ok) {
                    console.log("Workout logged successfully!");
                    window.dispatchEvent(new Event('workout-saved'));
                } else {
                    console.error("Failed to log workout");
                }
            } catch (error) {
                console.error("Network error while logging:", error);
            }
        };

        const handleBeforeUnload = (e) => {
            // Check if any sets or exercises have been marked as completed
            const hasProgress = plan.some(ex => ex.completed || (ex.sets && ex.sets.some(s => s.completed)));
            if (hasProgress) {
                e.preventDefault();
                e.returnValue = ''; // Standard way to trigger the browser's warning dialog
            }
        };

        window.addEventListener('finish-workout', handleFinishWorkout);
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('finish-workout', handleFinishWorkout);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [plan]);

    async function addExercise(tableRow) {
        const workoutData = {
            exerciseName: tableRow.exerciseName
        };

        try {
            console.log("Sending POST to backend:", workoutData);
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/tracker/${dayName}`, {
                method: 'POST',
                body: JSON.stringify(workoutData),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const json = await response.json();

            if (response.ok) {
                console.log("Backend save success:", json);
                setPlan(current => [...current, json]);
                setIsModalOpen(false);
            } else {
                console.error("Failed to add workout (backend error):", json);
            }
        } catch (error) {
            console.error("Network or Fetch Error:", error);
        }
    }
    function deleteExercise(workoutName) {
        setPlan(c => c.filter((row) => row.exerciseName !== workoutName));
    }

    const handleReset = async () => {   //optimistic UI
        const prevPlan = [...plan];

        const optimisticallyResetPlan = plan.map(workout => ({
            ...workout,
            status: "pending", // Or whatever your property name for completed state is
            isCompleted: false,
            completed: false,
            sets: workout.sets ? workout.sets.map(s => ({ ...s, completed: false })) : []
        }));

        setPlan(optimisticallyResetPlan);
        setGlobalReset(true);

        // 3. Send API Request
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/tracker/${dayName}`, {
                method: 'PATCH',
                body: JSON.stringify({dayName}),
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });

            if (!response.ok) {
                throw new Error('Failed to reset on backend');
            }

            //Re-sync with backend data just to be safe
            const workouts = await response.json();
            setPlan(workouts);

        } catch (err) {
            //Rollback if error
            console.log('Error in resetting progress!', err);
            setPlan(prevPlan);
            setGlobalReset(false);
        }
    }

    return (
        <ResetContext.Provider value={{ globalReset, setGlobalReset }}>
            <div className="min-h-screen flex flex-col w-full">
                <Header dayName={dayName} />
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
                <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col items-center px-4 mt-8">
                    {plan.length === 0 ? (
                        <div className="no-plan">
                            <div className="no-plan-message" onClick={() => setIsModalOpen(true)} style={{cursor: 'pointer'}}>
                                <h1>ADD NEW WORKOUT NOW!</h1>
                            </div>
                        </div>
                    ) : (
                        <Output list={plan} setList={setPlan} dayName={dayName} handleReset={handleReset} onDelete={(workoutName) => deleteExercise(workoutName)} />
                    )}
                </div>

            {/* Modal for Input */}
            {isModalOpen && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={(e) => {
                        if(e.target === e.currentTarget) setIsModalOpen(false);
                    }}
                >
                    <div className="relative bg-slate-900 p-6 rounded-xl shadow-2xl max-w-2xl w-full mx-4 border border-slate-700">
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white"
                        >
                            <X size={24} />
                        </button>
                        <Input onAddExercise={addExercise} />
                    </div>
                </div>
            )}

            {/* Floating Action Button */}
            <button 
                onClick={() => setIsModalOpen(true)} 
                className="fixed bottom-8 right-8 z-50 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:scale-110 transition-all cursor-pointer flex items-center justify-center"
            >
                <Plus size={28} />
            </button>

            <Footer />
            </div>
        </ResetContext.Provider>
    )
}

export default Tracker

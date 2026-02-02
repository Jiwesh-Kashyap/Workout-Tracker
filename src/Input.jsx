import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { workoutSchema } from './schema.js'; // Import your rules
import AmountSlider from './AmountSlider';

function Input({ onAddExercise }) {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            exerciseName: "",
            sets: "",
            reps: "",
            weights: 50
        },
        resolver: zodResolver(workoutSchema), // Connects Zod to React Hook Form
        mode: 'onTouched', // Only validate after user has interacted with the field
        reValidateMode: 'onChange', // Re-validate on change after first validation
        shouldFocusError: false, // Don't auto-focus on error
    });

    // Register weights manually
    React.useEffect(() => {
        register("weights");
    }, [register]);

    const [weights, setWeights] = useState(50);
    const [isWeighted, setIsWeighted] = useState(true);
    const [resetKey, setResetKey] = useState(0);

    function handleRadio(e) {
        if (e.target.id === "weighted") {
            setIsWeighted(true);
            setValue("weights", weights);
        }
        else if (e.target.id === "body-weight") {
            setIsWeighted(false);
            setWeights(0);
            setValue("weights", 0);
        }
    }
    // const handleEnter = (){

    // }
    const onSubmit = async (data) => {
        console.log("Submitting data:", data);
        const finalData = {
            ...data,
            weights: isWeighted ? weights : "NULL"
        };
        try {
            await onAddExercise(finalData);
            // Reset form with proper default values - use empty string for number inputs to ensure DOM clears
            reset({
                exerciseName: "",
                sets: "",
                reps: "",
                weights: 50
            }, {
                keepErrors: false, // Clear all errors
                keepDirty: false,  // Reset dirty state
                keepIsSubmitted: false, // Reset submitted state
                keepTouched: false, // Reset touched state
                keepIsValid: false, // Reset valid state
                keepSubmitCount: false // Reset submit count
            });
            setWeights(50);
            setIsWeighted(true);
            setValue("weights", 50);
            // Force re-render to clear DOM inputs
            setResetKey(prev => prev + 1);
        } catch (error) {
            console.error("Error in onAddExercise:", error);
        }
    };

    return (
        <div id='input'>
            <h2 id='input-header'>Log the exercise</h2>
            <form key={resetKey} onSubmit={handleSubmit(onSubmit)}>

                {/* Name */}
                <label htmlFor="name">
                    <h3>Name of exercise: </h3>
                </label>
                <input {...register("exerciseName")} placeholder='Bench Press'
                    type="text" id="name" className='input-box' defaultValue="" />
                {errors.exerciseName && (
                    <p className="error-msg">{errors.exerciseName.message}</p>
                )}

                {/* Sets */}
                <label htmlFor="sets">
                    <h3>Num of Sets: </h3>
                </label>
                <input  {...register("sets", { valueAsNumber: true })} placeholder='3'
                    type="number" id="sets" className='input-box' defaultValue="" />
                {errors.sets && (
                    <p className="error-msg">{errors.sets.message}</p>
                )}

                {/* Reps */}
                <label htmlFor="reps">
                    <h3>Num of reps: </h3>
                </label>
                <input  {...register("reps", { valueAsNumber: true })} placeholder='8'
                    type="number" id="reps" className='input-box' defaultValue="" />
                {errors.reps && (
                    <p className="error-msg">{errors.reps.message}</p>
                )}

                {/* Weights */}
                <label htmlFor="weights">
                    <h3>Weight Used: </h3>
                </label>

                <div id='label-of-weight'>
                    <div className='selector'>
                        <input type="radio" id="weighted"
                            onClick={handleRadio} name='weights' className='input-box' defaultChecked />
                        <label htmlFor="weighted">Weighted</label>
                    </div>
                    <div className='selector'>
                        <input type="radio" id="body-weight"
                            onClick={handleRadio} name='weights' className='input-box' />
                        <label htmlFor="body-weight">Body weight</label>
                    </div>
                </div>

                <div className={`amount-slider ${isWeighted ? 'active' : 'hidden'}`}>
                    <AmountSlider sliderVal={weights} setSliderVal={(val) => {
                        setWeights(val);
                        setValue("weights", val);
                    }} />
                </div>

                <button
                    className='enter-button'
                    type='submit'
                    disabled={isSubmitting}
                    style={{ marginTop: '20px' }}
                // onClick={handleEnter}
                >
                    {isSubmitting ? "Saving..." : "Add Workout"}
                </button>
            </form>
        </div>
    );
};
export default Input;
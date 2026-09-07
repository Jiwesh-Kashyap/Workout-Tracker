import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { workoutSchema } from './schema.js'; // Import your rules
import AmountSlider from './AmountSlider';
import { Plus } from 'lucide-react';

function Input({ onAddExercise }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            exerciseName: ""
        },
        mode: 'onTouched', // Only validate after user has interacted with the field
        reValidateMode: 'onChange', // Re-validate on change after first validation
        shouldFocusError: false, // Don't auto-focus on error
    });

    const [resetKey, setResetKey] = useState(0);

    const onSubmit = async (data) => {
        console.log("Submitting data:", data);
        try {
            await onAddExercise(data);
            reset({
                exerciseName: ""
            }, {
                keepErrors: false,
                keepDirty: false,
                keepIsSubmitted: false,
                keepTouched: false,
                keepIsValid: false,
                keepSubmitCount: false
            });
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
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
            weights: 50
        },
        resolver: zodResolver(workoutSchema), // Connects Zod to React Hook Form
    });

    // Register weights manually
    React.useEffect(() => {
        register("weights");
    }, [register]);

    const [weights, setWeights] = useState(50);
    const [isWeighted, setIsWeighted] = useState(true);
    // const [active, setActive] = useState(false);

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
    const onSubmit = async (data) => {//only runs upon validation
        const finalData = {
            ...data,
            weights: isWeighted ? weights : "Body Weight"
        };
        onAddExercise(finalData);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        reset();    //clears text input
        reset();    //clears text input
        setWeights(50);
        setValue("weights", 50);
    };
    return (
        <div id='input'>
            <h2 id='input-header'>Log the exercise</h2>
            <form onSubmit={handleSubmit(onSubmit)}>

                {/* Name */}
                <label htmlFor="name">
                    <h3>Name of exercise: </h3>
                </label>
                <input {...register("exerciseName")} placeholder='Bench Press'
                    type="text" id="name" className='input-box' />
                {errors.exerciseName && (
                    <p className="error-msg">{errors.exerciseName.message}</p>
                )}

                {/* Sets */}
                <label htmlFor="sets">
                    <h3>Num of Sets: </h3>
                </label>
                <input  {...register("sets")} placeholder='3'
                    type="text" id="sets" className='input-box' />
                {errors.sets && (
                    <p className="error-msg">{errors.sets.message}</p>
                )}

                {/* Reps */}
                <label htmlFor="reps">
                    <h3>Num of reps: </h3>
                </label>
                <input  {...register("reps")} placeholder='8'
                    type="text" id="reps" className='input-box' />
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
                <br />

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
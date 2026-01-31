const Workout = require('../models/workoutModel');

async function getWorkouts(req, res){
    const workouts = await Workout.find({}).sort({createdAt: -1});    //newest first
    res.status(200).json(workouts);
}

async function createWorkout(req, res){
    const {exerciseName, numOfSets, numOfReps, weight} = req.body;
    try{
        const newWorkout = await Workout.create({exerciseName, numOfSets, numOfReps, weight});
        res.status(200).json(newWorkout);
    } catch (error) {
        console.error("createWorkout: Error creating document:", error);
        res.status(400).json({ message: "error occured while creating workout!" })
    }
}

module.exports = { getWorkouts, createWorkout };
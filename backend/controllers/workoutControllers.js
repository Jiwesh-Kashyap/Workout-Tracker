const Workout = require('../models/workoutModel');

async function getWorkouts(req, res) {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const workouts = await Workout.find({ createdBy: req.user._id }).sort({ createdAt: -1 });    //newest first
    res.status(200).json(workouts);
}

async function createWorkout(req, res) {
    const { exerciseName, numOfSets, numOfReps, weight } = req.body;

    console.log("[CONTROLLER DEBUG] createWorkout hit. Body:", req.body);
    console.log("[CONTROLLER DEBUG] req.user is:", req.user);

    if (!req.user) {
        console.log("[CONTROLLER DEBUG] 401 Unauthorized - No req.user");
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const newWorkout = await Workout.create({
            exerciseName,
            numOfSets,
            numOfReps,
            weight,
            createdBy: req.user._id
        });
        res.status(200).json(newWorkout);
    } catch (error) {
        console.error("createWorkout: Error creating document:", error);
        res.status(400).json({ message: "error occured while creating workout!" })
    }
}

module.exports = { getWorkouts, createWorkout };
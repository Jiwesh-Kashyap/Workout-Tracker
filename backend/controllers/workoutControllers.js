const Workout = require('../models/workoutModel');

const Schedule = require('../models/schedule');

async function getWorkouts(req, res) {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const { dayName } = req.params; //how the dayname is in params
    const schedule = await Schedule.findOne({ dayName, createdBy: req.user._id });

    if (!schedule) {
        return res.status(404).json({ error: "Schedule not found!" });
    }

    const workouts = await Workout.find({ scheduleID: schedule._id }).sort({ createdAt: -1 });    //newest first
    res.status(200).json(workouts);
}
async function updateWorkout(req, res){
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const { dayName } = req.params;
    const schedule = await Schedule.findOne({ dayName, createdBy: req.user._id });

    if (!schedule) {
        return res.status(404).json({ error: "Schedule not found!" });
    }

    const workout = await Workout.findOne({scheduleID: schedule._id, exerciseName: req.body.name});
    workout.completed = !workout.completed;

    await workout.save();

    res.status(200).json({workout, message: 'successfully updated workout in db'});
}
async function createWorkout(req, res) {
    const { exerciseName, numOfSets, numOfReps, weight } = req.body;
    const { dayName } = req.params;

    console.log("[CONTROLLER DEBUG] createWorkout hit. Body:", req.body);
    console.log("[CONTROLLER DEBUG] req.user is:", req.user);

    if (!req.user) {
        console.log("[CONTROLLER DEBUG] 401 Unauthorized - No req.user");
        return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
        const schedule = await Schedule.findOne({ dayName, createdBy: req.user._id });
        if (!schedule) {
            return res.status(404).json({ error: "Schedule not found!" });
        }

        const newWorkout = await Workout.create({
            exerciseName,
            numOfSets,
            numOfReps,
            weight,
            createdBy: req.user._id,
            scheduleID: schedule._id,
        });
        res.status(200).json(newWorkout);
    } catch (error) {
        console.error("createWorkout: Error creating document:", error);
        res.status(400).json({ message: "error occured while creating workout!" })
    }
}
async function deleteWorkout(req, res){
    try{
        const workoutName = req.body.name;
        const { dayName } = req.params;

        const schedule = await Schedule.findOne({ dayName, createdBy: req.user._id });
        if (!schedule) {
            return res.status(404).json({ error: "Schedule not found!" });
        }

        const workout = await Workout.findOne({ exerciseName: workoutName, scheduleID: schedule._id });
        if (!workout) {
            return res.status(404).json({ error: "Workout not found!" });
        }
        await workout.deleteOne();
        res.status(200).json({ message: "Successfully deleted", id: workout._id });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}


module.exports = { getWorkouts, createWorkout, deleteWorkout, updateWorkout };
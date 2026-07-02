const Workout = require('../models/workoutModel');

const Schedule = require('../models/schedule');

async function getWorkouts(req, res) {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const { dayName } = req.params; //how the dayname is in params
    const schedule = await Schedule.findOne({ dayName, createdBy: req.user._id });

    if (!schedule) {
        return res.status(404).json({ error: "Schedule not found!" });
    }

    const workouts = await Workout.find({ scheduleID: schedule._id }).sort({ order: 1 });    //oldest first
    res.status(200).json(workouts);
}
async function resetWorkouts(req, res){
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const { dayName } = req.params; 
    const schedule = await Schedule.findOne({ dayName, createdBy: req.user._id });
    const workouts = await Workout.find({scheduleID: schedule._id}).sort({ order: 1 });

    for (let index = 0; index < workouts.length; index++) {
        workouts[index].completed = false;
        await workouts[index].save();
    }

    res.status(200).json(workouts);
}
async function updateWorkout(req, res){
    const { intent } = req.body;
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    if(req.body.intent=="SORT_WORKOUT"){
        const {dayName} = req.params;
        const schedule = await Schedule.findOne({ dayName, createdBy: req.user._id});
        
        const orderOfObjectIds = req.body.orderOfObjectIds;

        for(let i = 0; i < orderOfObjectIds.length; i++){
            const currWorkout = await Workout.findById(orderOfObjectIds[i]);
            currWorkout.order = i;
            await currWorkout.save();
        }

        return res.status(200).json({message: 'Sorting successful in database'});
    }

    if(intent==="EDIT_WORKOUT"){
        const { dayName } = req.params;
        const schedule = await Schedule.findOne({ dayName, createdBy: req.user._id });
        
        const body = req.body;

        if (!schedule) {
            return res.status(404).json({ error: "Schedule not found!" });
        }
    
        const workout = await Workout.findOne({scheduleID: schedule._id, exerciseName: req.body.name});
        workout.numOfReps = body.numOfReps;
        workout.numOfSets = body.numOfSets;
        workout.weight = body.weight;

        await workout.save(); // Don't forget to save to the database!

        res.status(200).json({ numOfReps: body.numOfReps, numOfSets: body.numOfSets, weight: body.weight });
    }
    else if(intent==="COMPLETE_WORKOUT"){
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


module.exports = { getWorkouts, createWorkout, deleteWorkout, updateWorkout, resetWorkouts };
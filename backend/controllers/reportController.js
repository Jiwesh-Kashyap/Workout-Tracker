const Workout = require("../models/workoutModel");
const workoutLogModel = require("../models/workoutLogModel");

const getProgressiveOverload = async (req, res) => {
  try {
    const { exerciseName } = req.query;
    const userId = req.user._id;

    const history = await workoutLogModel.find({
      createdBy: userId,
      exerciseName: exerciseName,
    })
      .sort({ createdAt: 1 })
      .select("weight numOfSets numOfReps createdAt exerciseName");

    console.log("ExerciseName query:", exerciseName);
    console.log("HISTORY:", history);

    const charData = history.map((session) => ({
      date: session.createdAt.toISOString().split("T")[0],
      weight: session.weight,
      volume: session.weight * session.numOfSets * session.numOfReps,
      sets: session.numOfSets,
      reps: session.numOfReps,
    }));

    res.status(200).json(charData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error generating report", error: error.message });
  }
};

const comparePreviousWorkout = async (req, res) => {
  try {
    const { exerciseName } = req.query;
    const userId = req.user._id;

    const recentWorkouts = await workoutLogModel.find({
      createdBy: userId,
      exerciseName: exerciseName,
    })
      .sort({ createdAt: -1 })
      .limit(2);    //current and prev

    if (recentWorkouts.length < 2) {
      return res
        .status(200)
        .json({ message: "Not enough data to compare yet." });
    }

    const current = recentWorkouts[0];
    const previous = recentWorkouts[1];

    const comparison = {
      exerciseName: exerciseName,
      currentDate: current.createdAt,
      previousDate: previous.createdAt,
      weightDiff: current.weight - previous.weight,
      repsDiff:
        current.numOfSets * current.numOfReps -
        previous.numOfSets * previous.numOfReps,
      volumeDiff:
        current.weight * current.numOfSets * current.numOfReps -
        previous.weight * previous.numOfSets * previous.numOfReps,
    };

    res.status(200).json(comparison);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error comparing workouts", error: error.message });
  }
};

const finishWorkout = async (req, res) => {
    try {
        const { exercises, updateTemplate } = req.body;
        const userId = req.user._id;

        //iterate over each exercise
        const logsToSave = exercises.map(ex => ({   
            exerciseName: ex.exerciseName,
            numOfSets: ex.numOfSets,
            numOfReps: ex.numOfReps,
            weight: ex.weight,
            createdBy: userId,
            templateWorkoutId: ex._id,
            isSaved: true
        }));

        await workoutLogModel.insertMany(logsToSave);

        //update the workout if user insists
        if(updateTemplate){ 
            for(let ex of exercises){
                await Workout.findByIdAndUpdate(ex._id, {
                    weight: ex.weight,
                    numOfSets: ex.numOfSets,
                    numOfReps: ex.numOfReps
                });
            }
        }

        res.status(200).json({message: "Workout saved successfully! "});
    } catch(error){
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getProgressiveOverload,
    comparePreviousWorkout,
    finishWorkout
};
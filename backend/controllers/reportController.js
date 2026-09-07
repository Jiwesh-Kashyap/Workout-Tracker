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
      .select("sets createdAt exerciseName");

    console.log("ExerciseName query:", exerciseName);
    console.log("HISTORY:", history);

    const charData = history.map((session) => {
      // ONLY count sets that were actually marked as completed!
      const completedSets = session.sets.filter(set => set.completed);
      
      const totalVolume = completedSets.reduce((acc, set) => acc + (set.weight * set.reps), 0);
      const totalReps = completedSets.reduce((acc, set) => acc + set.reps, 0);
      const maxWeight = completedSets.length > 0 ? Math.max(...completedSets.map(s => s.weight)) : 0;
      
      return {
        date: session.createdAt.toISOString().split("T")[0],
        weight: maxWeight,
        volume: totalVolume,
        sets: completedSets.length,
        reps: totalReps,
      }
    });

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

    // Filter for completed sets only
    const currentCompleted = current.sets.filter(s => s.completed);
    const previousCompleted = previous.sets.filter(s => s.completed);

    const currentVolume = currentCompleted.reduce((acc, set) => acc + (set.weight * set.reps), 0);
    const previousVolume = previousCompleted.reduce((acc, set) => acc + (set.weight * set.reps), 0);
    
    const currentReps = currentCompleted.reduce((acc, set) => acc + set.reps, 0);
    const previousReps = previousCompleted.reduce((acc, set) => acc + set.reps, 0);

    const currentMaxWeight = currentCompleted.length > 0 ? Math.max(...currentCompleted.map(s => s.weight)) : 0;
    const previousMaxWeight = previousCompleted.length > 0 ? Math.max(...previousCompleted.map(s => s.weight)) : 0;

    const comparison = {
      exerciseName: exerciseName,
      currentDate: current.createdAt,
      previousDate: previous.createdAt,
      weightDiff: currentMaxWeight - previousMaxWeight,
      repsDiff: currentReps - previousReps,
      volumeDiff: currentVolume - previousVolume,
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
            sets: ex.sets || [],
            createdBy: userId,
            templateWorkoutId: ex._id,
            isSaved: true
        }));

        await workoutLogModel.insertMany(logsToSave);

        //update the workout if user insists
        if(updateTemplate){ 
            for(let ex of exercises){
                await Workout.findByIdAndUpdate(ex._id, {
                    sets: ex.sets || []
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
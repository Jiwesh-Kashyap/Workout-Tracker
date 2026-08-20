const mongoose = require("mongoose");

const workoutLogSchema = mongoose.Schema(
  {
    exerciseName: { type: String, required: true },
    numOfSets: { type: Number, required: true },
    numOfReps: { type: Number, required: true },
    weight: { type: Number, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },

    templateWorkoutId: { type: mongoose.Schema.Types.ObjectId, ref: "workout" },

    isSaved: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model('workoutLog', workoutLogSchema);
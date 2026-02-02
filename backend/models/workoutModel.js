const mongoose = require('mongoose');

const workoutSchema = mongoose.Schema({
    exerciseName: {
        type: String,
        required: true
    },
    numOfSets: {
        type: Number,
        required: true
    },
    numOfReps: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    }
}, {timestamps: true});

const workoutModel = mongoose.model('workout', workoutSchema);

module.exports = workoutModel;
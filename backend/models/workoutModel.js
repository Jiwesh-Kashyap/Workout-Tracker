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
    }
}, {timestamp: true});

const workoutModel = mongoose.model('exercise', workoutSchema);

module.exports = workoutModel;
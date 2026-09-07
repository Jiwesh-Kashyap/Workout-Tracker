const mongoose = require('mongoose');

const setSchema = new mongoose.Schema({
    reps: {type: Number, required: true},
    weight: {type: Number, required: true},
    completed: {type: Boolean, default: false}
});

const workoutSchema = mongoose.Schema({
    exerciseName: {
        type: String,
        required: true
    },
    sets: [setSchema],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    completed: {
        type: Boolean,
        default: false,
    },
    scheduleID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "schedule",
    },
    order: {
        type: Number,
        default: 0,
    },
}, {timestamps: true});

const workoutModel = mongoose.model('workout', workoutSchema);

module.exports = workoutModel;
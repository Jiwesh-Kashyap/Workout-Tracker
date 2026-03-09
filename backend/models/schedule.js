const mongoose = require('mongoose');

const scheduleSchema = mongoose.Schema({
    dayName: {
        type: String,
        required: true,
    },
    message: {
        type: String,
    },
    checker: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    }
}, {timestamps: true});

const Schedule = mongoose.model('schedule', scheduleSchema);

module.exports = Schedule;
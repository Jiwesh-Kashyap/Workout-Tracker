const express = require('express');
const router = express.Router();
const {getWorkouts, createWorkout, deleteWorkout} = require('../controllers/workoutControllers');

router.get('/', getWorkouts);
router.post('/', createWorkout);
router.delete('/', deleteWorkout);

module.exports = router;
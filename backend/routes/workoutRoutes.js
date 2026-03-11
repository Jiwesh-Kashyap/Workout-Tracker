const express = require('express');
const router = express.Router();
const {getWorkouts, createWorkout, deleteWorkout, updateWorkout} = require('../controllers/workoutControllers');

router.get('/:dayName', getWorkouts);
router.post('/:dayName', createWorkout);
router.delete('/:dayName', deleteWorkout);
router.put('/:dayName', updateWorkout);

module.exports = router;
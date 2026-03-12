const express = require('express');
const router = express.Router();
const {getWorkouts, createWorkout, deleteWorkout, updateWorkout, resetWorkouts } = require('../controllers/workoutControllers');

router.get('/:dayName', getWorkouts);
router.post('/:dayName', createWorkout);
router.delete('/:dayName', deleteWorkout);
router.put('/:dayName', updateWorkout);
router.patch('/:dayName', resetWorkouts);

module.exports = router;
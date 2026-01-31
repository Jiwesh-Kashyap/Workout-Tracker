const express = require('express');
const router = express.Router();
const {getWorkouts, createWorkout} = require('../controllers/workoutControllers');

router.get('/', getWorkouts);
router.post('/', createWorkout);

module.exports = router;
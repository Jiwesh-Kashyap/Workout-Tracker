const express = require('express');
const router = express.Router();
const { getProgressiveOverload, comparePreviousWorkout, finishWorkout } = require('../controllers/reportController');

router.get('/progressive-overload', getProgressiveOverload);
router.get('/compare-last', comparePreviousWorkout);
router.post('/finish', finishWorkout);

module.exports = router;

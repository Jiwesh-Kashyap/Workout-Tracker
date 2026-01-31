require('dotenv').config({ path: './.env' });   //acquiring env variables

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');   //frontend talks to backend
const router = require('./routes/workoutRoutes');

const app = express();

app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.path}`);
    next();
});

app.use(express.json());
app.use(cors()); //fixes the CORS error

app.use('/api/workouts', router);

app.get('/', () => {
    res.json({ message: 'Welcome to workout tracker app.' });
})

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // Only start listening once we are connected to the DB
        app.listen(process.env.PORT, () => {
            console.log(`Connected to DB & listening on port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });

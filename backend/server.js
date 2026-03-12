require('dotenv').config({ path: './.env' });   //acquiring env variables

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');   //frontend talks to backend
const workoutRouter = require('./routes/workoutRoutes');
const userRouter = require('./routes/user');
const scheduleRouter = require('./routes/schedule');

const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middleware/authn');

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "https://workout-tracker-5ym.pages.dev"],
    credentials: true,
})); //fixes the CORS error

app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.path}`);
    next();
});

app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.use('/tracker', workoutRouter);
app.use('/api/user', userRouter);
app.use('/', scheduleRouter);

app.get('/', () => {
    res.json({ message: 'Welcome to workout tracker app.' });
})

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        const port = process.env.PORT || 4000;
        // Only start listening once we are connected to the DB
        app.listen(port,"0.0.0.0" ,() => {
            console.log(`Connected to DB & listening on port ${port}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });

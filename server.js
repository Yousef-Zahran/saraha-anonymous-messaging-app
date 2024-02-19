const express = require('express')
const app = express()

const connect_to_database = require('./config/connection');
const deleteUnconfirmedAccounts = require('./utils/cronJob.js')
const dotenv = require('dotenv');
dotenv.config({ path: ".env" });
const port = process.env.PORT || 5000;

const morgan = require('morgan');
const cors = require('cors')
const apiError = require('./utils/apiError');
const globalError = require('./middlewares/errorMiddleware');
const userRouter = require('./routes/userRoute');
const messageRouter = require('./routes/messageRoute.js');
if (process.env.NODE_ENV == "development") {
    app.use(morgan('dev'));
} else {
    console.log('morgan not working')
}


connect_to_database();

deleteUnconfirmedAccounts()


app.use(cors())

app.use((express.json()));
app.use('/uploads', express.static('uploads'));

app.use('/api/v1/user', userRouter)
app.use('/api/v1/message', messageRouter)
    // handlers for routes errors
app.all('*', (req, res, next) => {
    const error = `can not find this route ${req.originalUrl}`
    next(new apiError(error, 404));
})

app.use(globalError)




const server = app.listen(port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Saraha app listening on port ${ port }!`);
    }
});

// Handle Rejection outside express
process.on('unhandledRejection', (err) => {
    console.error(`unhandledRejection Errors: ${err.name} | ${err.message}`);
    //server will close before ending the process
    server.close(() => {
        console.error('shutting down....');
        process.exit(1);
    });
});
const mongoose = require('mongoose');
const connectToDataBase = () => {
    mongoose.connect(process.env.DATABASE_URI).then((DB) => {
        console.log(`Connected to database ${DB.connection.host}`);
    }).catch((error) => {
        console.log(`Error connecting to ${error}`);
    })
}
module.exports = connectToDataBase;
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: [3, 'Too short name'],
        maxlength: [20, 'Too long name'],
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Too short password'],
    },

    profilePicture: String,
    isConfirmed: {
        type: Boolean,
        default: false,
    },
    coverImages: [String],
    gender: {
        type: String,
        enum: ['male', 'female'],
    }


}, { timestamps: true })

userSchema.pre('save', async function() {
    if (this.isModified('password')) {
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash
    }

});
userSchema.methods.checkPassword = async function(password) {
    const reslut = await bcrypt.compare(password, this.password)
    return reslut;
}


const userModel = mongoose.model('User', userSchema)
module.exports = userModel
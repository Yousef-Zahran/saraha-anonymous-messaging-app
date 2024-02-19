const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const catchError = require("../utils/catchErrors");
const apiError = require("../utils/apiError");
const sendEmail = require("../utils/sendMail");
const multer = require('multer')
const signUp = catchError(async(req, res, next) => {
    const { name, email, password } = req.body;
    const checkExistence = await userModel.findOne({ email });
    if (!checkExistence) {
        const token = jwt.sign({ email }, process.env.USER_KEY);

        const result = await sendEmail({
            to: email,
            html: `< a href=http://localhost:3000/api/v1/user/auth/${token} >Please click me to verify Your account < /a>`,
            subject: "verify Email ✔.....Welcome to Saraha! We're thrilled to have you join our community. Your account has been successfully created.",
        });

        if (!result) {
            return next(
                new apiError(
                    "Couldn't find this email address,Please enter your email address",
                    404
                )
            );
        }
        const user = new userModel({ name, email, password });
        await user.save();
        user.password = undefined;
        // console.log(result);
        return res.status(200).json(user);
    }
    next(new apiError("This user is already exist", 400));
});

const signIn = catchError(async(req, res, next) => {
    const user = await userModel.findOne({ email: req.body.email });
    if (user) {
        const result = await user.checkPassword(req.body.password);
        if (result) {
            if (!user.isConfirmed)
                return next(
                    new apiError(
                        "You have to confirm your email first, Go check your email box!",
                        400
                    )
                );
            const id = user._id;
            const token = jwt.sign({ id }, process.env.USER_KEY, { expiresIn: "7d" });
            user.password = undefined;
            res.status(200).json({ token, user });
        } else {
            next(new apiError("Wrong password, Please try again!", 400));
        }
    } else {
        next(new apiError("You do not have account in this email", 404));
    }
});

const updateUser = catchError(async(req, res, next) => {
    const id = req.verifyingUserId;
    // console.log(req.files.coverImages)
    if (req.files && req.files['coverImages']) {
        var coverImages = req.files.coverImages[0].filename;
    }
    if (req.files && req.files['profilePicture']) {
        var profilePicture = req.files.profilePicture[0].filename;
    }

    const { name, password } = req.body;
    const user = await userModel.findById({ _id: id });
    if (!user) {
        return next(new apiError("user not found", 404));
    }
    if (name) user.name = name;
    if (password) user.password = password;
    if (profilePicture) user.profilePicture = profilePicture;
    if (coverImages) user.coverImages = [...user.coverImages, coverImages];
    await user.save();
    res.status(200).json({ success: true, results: user })
});
const deleteUser = (req, res, next) => {
    const userToken = req.headers.authorization;
    jwt.verify(userToken, process.env.USER_KEY, async(err, decoded) => {
        if (err) {
            next(new apiError("Unauthorized!, Error verifying token", 401));
        }
        const payload = decoded;
        await userModel.findByIdAndDelete({ _id: payload.id });
        res
            .status(200)
            .json({ success: true, results: "user successfully deleted" });
    });
};

const getMyAccount = catchError(async(req, res, next) => {
    const id = req.verifying.userId;
    const myProfile = await userModel.findById({ _id: id });
    if (myProfile) {
        myProfile.password = undefined;
        res.status(200).json({ success: true, results: myProfile });
    }
});

const getProfile = catchError(async(req, res, next) => {
    const { id } = req.params;
    const user = await userModel.findById({ _id: id });
    if (user) {
        user.password = undefined;
        res.status(200).json({ success: true, results: user });
    }
});

const confirmEmail = catchError(async(req, res, next) => {
    const { token } = req.params;
    // console.log(token)
    const { email } = jwt.verify(token, process.env.USER_KEY);
    const user = await userModel.findOne({ email });
    console.log(email);
    user.isConfirmed = true;
    await user.save();
    res
        .status(200)
        .json({
            success: true,
            results: "your account has been confirmed successfully",
        });
});




const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads/profileImages");
    },
    filename: function(req, file, cb) {
        const ext = file.mimetype.split("/")[1];
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const filename = file.fieldname + "-" + uniqueSuffix + `.${ext}`;
        cb(null, filename);
    },
});

const multerFilter = (req, file, cb) => {
    // console.log(file.fieldname);
    // console.log("req: ", req.file)
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(new apiError("Only Images allowed", 400), false);
    }
};

const upload = multer({ storage: storage, fileFilter: multerFilter });
// const uploadImge = upload.single("profilePicture");
const uploadMultipleImages = upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "coverImages", maxCount: 1 },
]);




module.exports = { signUp, signIn, getMyAccount, confirmEmail, updateUser, deleteUser, uploadMultipleImages };
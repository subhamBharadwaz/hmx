"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminDeleteUser = exports.adminUpdateUserDetails = exports.adminSingleUser = exports.adminAllUsers = exports.updateUserDetails = exports.changePassword = exports.getUser = exports.passwordReset = exports.forgotPassword = exports.logout = exports.login = exports.register = void 0;
const cloudinary_1 = require("cloudinary");
const crypto_1 = __importDefault(require("crypto"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("config"));
const user_model_1 = __importDefault(require("../models/user.model"));
const index_1 = require("../middlewares/index");
const index_2 = require("../utils/index");
let logErr;
exports.register = (0, index_1.BigPromise)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files) {
        logErr = new index_2.CustomError('Photo is required for register', 400);
        index_2.logger.error(logErr);
        return next(logErr);
    }
    const { firstName, lastName, email, password } = req.body;
    if (!(firstName && lastName && email && password)) {
        logErr = new index_2.CustomError('First Name, Last Name, Email, Password and Photo are required', 400);
        index_2.logger.error(logErr);
        return next(logErr);
    }
    const file = req.files.photo;
    const extensionName = path_1.default.extname(file.name);
    const allowedExtensions = ['.png', '.jpg', '.jpeg'];
    if (!allowedExtensions.includes(extensionName)) {
        logErr = new index_2.CustomError('Invalid Image', 422);
        index_2.logger.error(logErr);
        return next(logErr);
    }
    const result = yield cloudinary_1.v2.uploader.upload(file.tempFilePath, {
        folder: config_1.default.get('userImageDir'),
        width: 150,
        crop: 'scale'
    });
    const existingUser = yield user_model_1.default.findOne({ email });
    if (existingUser) {
        logErr = new index_2.CustomError('User already exists!', 401);
        index_2.logger.error(logErr);
        return next(logErr);
    }
    const user = yield user_model_1.default.create({
        firstName,
        lastName,
        email,
        password,
        photo: {
            id: result.public_id,
            secure_url: result.secure_url
        }
    });
    (0, index_2.cookieToken)(user, res);
}));
exports.login = (0, index_1.BigPromise)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!(email && password)) {
        logErr = new index_2.CustomError('Email, Password are required', 400);
        index_2.logger.error(logErr);
        return next(logErr);
    }
    const user = yield user_model_1.default.findOne({ email }).select('+password');
    if (!user) {
        logErr = new index_2.CustomError('Email or password does not match or exist', 400);
        index_2.logger.error(logErr);
        return next(logErr);
    }
    const isPasswordCorrect = yield user.comparePassword(password);
    if (!isPasswordCorrect) {
        logErr = new index_2.CustomError('Email or password does not match or exist', 400);
        index_2.logger.error(logErr);
        return next(logErr);
    }
    (0, index_2.cookieToken)(user, res);
}));
exports.logout = (0, index_1.BigPromise)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.status(200).json({
        success: true,
        message: 'Logout Success'
    });
}));
exports.forgotPassword = (0, index_1.BigPromise)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield user_model_1.default.findOne({ email });
    if (!user) {
        logErr = new index_2.CustomError('User does not exist', 400);
        index_2.logger.error(logErr);
        return next(logErr);
    }
    const forgotToken = user.getForgotPasswordToken();
    yield user.save({ validateBeforeSave: false });
    const forgotPasswordUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${forgotToken}`;
    const message = `Copy paste this link in your url and hit enter \n\n ${forgotPasswordUrl}`;
    try {
        yield (0, index_2.mailHelper)({
            email: user.email,
            subject: 'HMX - Password reset email',
            message
        });
        res.status(200).json({ success: true, message: 'Email sent successfully' });
    }
    catch (err) {
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;
        yield user.save({ validateBeforeSave: false });
        let errorMessage = 'Failed to send email';
        if (err instanceof Error) {
            errorMessage = err.message;
            logErr = new index_2.CustomError(errorMessage, 500);
            index_2.logger.error(logErr);
            return next(logErr);
        }
        logErr = new index_2.CustomError(errorMessage, 500);
        index_2.logger.error(logErr);
        return next(logErr);
    }
}));
exports.passwordReset = (0, index_1.BigPromise)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const encryptedToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
    const user = yield user_model_1.default.findOne({
        encryptedToken,
        forgotPasswordExpiry: { $gt: Date.now() }
    });
    if (!user) {
        logErr = new index_2.CustomError('Token is invalid or expired', 400);
        index_2.logger.error(logErr);
        return next(logErr);
    }
    if (req.body.password !== req.body.confirmPassword) {
        logErr = new index_2.CustomError('Password and confirm password do not matched', 400);
        index_2.logger.error(logErr);
        return next(logErr);
    }
    user.password = req.body.password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    yield user.save();
    const message = `Hello ${user.firstName}! Your password has been reset successfully.`;
    try {
        yield (0, index_2.mailHelper)({
            email: user.email,
            subject: 'HMX - Password reset successful',
            message
        });
        res.status(200).json({ success: true, message: 'Email sent successfully' });
    }
    catch (err) {
        let errorMessage = 'Failed to send email';
        if (err instanceof Error) {
            errorMessage = err.message;
            logErr = new index_2.CustomError(errorMessage, 500);
            index_2.logger.error(logErr);
            return next(logErr);
        }
        logErr = new index_2.CustomError(errorMessage, 500);
        index_2.logger.error(logErr);
        return next(logErr);
    }
    (0, index_2.cookieToken)(user, res);
}));
exports.getUser = (0, index_1.BigPromise)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(req.user.id).select('-password');
    res.status(200).json({ success: true, user });
}));
exports.changePassword = (0, index_1.BigPromise)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const user = yield user_model_1.default.findById(userId).select('+password');
    const isCorrectCurrentPassword = yield (user === null || user === void 0 ? void 0 : user.comparePassword(req.body.currentPassword));
    if (!isCorrectCurrentPassword) {
        logErr = new index_2.CustomError('Current password is incorrect', 400);
        index_2.logger.error(logErr);
        return next(logErr);
    }
    if (req.body.newPassword !== req.body.confirmNewPassword) {
        logErr = new index_2.CustomError('New password and confirm password do not matched', 400);
        index_2.logger.error(logErr);
        return next(logErr);
    }
    if (user !== null) {
        user.password = req.body.newPassword;
        yield user.save();
        (0, index_2.cookieToken)(user, res);
    }
}));
exports.updateUserDetails = (0, index_1.BigPromise)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email } = req.body;
    const newData = {
        firstName,
        lastName,
        email
    };
    if (req.files) {
        const user = yield user_model_1.default.findById(req.user.id);
        const imageId = user === null || user === void 0 ? void 0 : user.photo.id;
        yield cloudinary_1.v2.uploader.destroy(imageId);
        const file = req.files.photo;
        const extensionName = path_1.default.extname(file.name);
        const allowedExtensions = ['.png', '.jpg', '.jpeg'];
        if (!allowedExtensions.includes(extensionName)) {
            logErr = new index_2.CustomError('Invalid Image', 422);
            index_2.logger.error(logErr);
            return next(logErr);
        }
        const result = yield cloudinary_1.v2.uploader.upload(file.tempFilePath, {
            folder: config_1.default.get('userImageDir'),
            width: 150,
            crop: 'scale'
        });
        newData.photo = {
            id: result.public_id,
            secure_url: result.secure_url
        };
    }
    const user = yield user_model_1.default.findByIdAndUpdate(req.user.id, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    }).select('-password');
    res.status(201).json({ success: true, user });
}));
exports.adminAllUsers = (0, index_1.BigPromise)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.default.find().select('-password');
    res.status(200).json({ success: true, users });
}));
exports.adminSingleUser = (0, index_1.BigPromise)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    (0, index_2.isValidMongooseObjectId)(id, next);
    const user = yield user_model_1.default.findById(id).select('-password');
    if (!user) {
        logErr = new index_2.CustomError(`No user found with the id of ${id}`, 400);
        index_2.logger.error(logErr);
        return next(logErr);
    }
    res.status(200).json({ success: true, user });
}));
exports.adminUpdateUserDetails = (0, index_1.BigPromise)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { firstName, lastName, email, role } = req.body;
    const newData = {
        firstName,
        lastName,
        email,
        role
    };
    (0, index_2.isValidMongooseObjectId)(id, next);
    const isUserExists = yield user_model_1.default.findById(id);
    if (!isUserExists) {
        logErr = new index_2.CustomError(`No user found with the id of ${id}`, 401);
        index_2.logger.error(logErr);
        return next(logErr);
    }
    const user = yield user_model_1.default.findByIdAndUpdate(id, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    }).select('-password');
    res.status(201).json({ success: true, user });
}));
exports.adminDeleteUser = (0, index_1.BigPromise)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    (0, index_2.isValidMongooseObjectId)(id, next);
    const user = yield user_model_1.default.findById(id);
    if (!user) {
        logErr = new index_2.CustomError(`No user found with the id of ${id}`, 401);
        index_2.logger.error(logErr);
        return next(logErr);
    }
    const imageId = user.photo.id;
    yield cloudinary_1.v2.uploader.destroy(imageId);
    yield user.remove();
    res.status(200).json({
        success: true,
        message: `Successfully deleted the user with id ${id}`
    });
}));

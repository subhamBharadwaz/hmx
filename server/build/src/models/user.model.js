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
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const config_1 = __importDefault(require("config"));
const UserSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: [true, 'Please provide your First Name']
    },
    lastName: {
        type: String,
        required: [true, 'Please provide your Last Name']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password']
    },
    photo: {
        id: {
            type: String,
            required: true
        },
        secure_url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: 'user'
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date
}, {
    timestamps: true
});
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password'))
            return next();
        this.password = yield bcryptjs_1.default.hash(this.password, 10);
    });
});
UserSchema.methods.comparePassword = function (userPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const comparedPassword = yield bcryptjs_1.default.compare(userPassword, this.password);
        return comparedPassword;
    });
};
UserSchema.methods.getJwtToken = function () {
    const jwtSecret = config_1.default.get('jwtSecret');
    const jwtExpiry = config_1.default.get('jwtExpiry');
    return jsonwebtoken_1.default.sign({ id: this._id }, jwtSecret, {
        expiresIn: jwtExpiry
    });
};
UserSchema.methods.getForgotPasswordToken = function () {
    const forgotToken = crypto_1.default.randomBytes(20).toString('hex');
    this.forgotPasswordToken = crypto_1.default.createHash('sha256').update(forgotToken).digest('hex');
    this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;
    return forgotToken;
};
const UserModel = (0, mongoose_1.model)('User', UserSchema);
exports.default = UserModel;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.changePasswordSchema = exports.passwordResetSchema = exports.forgotPasswordSchema = exports.loginUserSchema = exports.registerUserSchema = void 0;
var registerUser_schema_1 = require("./registerUser.schema");
Object.defineProperty(exports, "registerUserSchema", { enumerable: true, get: function () { return __importDefault(registerUser_schema_1).default; } });
var loginUser_schema_1 = require("./loginUser.schema");
Object.defineProperty(exports, "loginUserSchema", { enumerable: true, get: function () { return __importDefault(loginUser_schema_1).default; } });
var forgotPassword_schema_1 = require("./forgotPassword.schema");
Object.defineProperty(exports, "forgotPasswordSchema", { enumerable: true, get: function () { return __importDefault(forgotPassword_schema_1).default; } });
var resetPassword_schema_1 = require("./resetPassword.schema");
Object.defineProperty(exports, "passwordResetSchema", { enumerable: true, get: function () { return __importDefault(resetPassword_schema_1).default; } });
var changePassword_schema_1 = require("./changePassword.schema");
Object.defineProperty(exports, "changePasswordSchema", { enumerable: true, get: function () { return __importDefault(changePassword_schema_1).default; } });
var updateUser_schema_1 = require("./updateUser.schema");
Object.defineProperty(exports, "updateUserSchema", { enumerable: true, get: function () { return __importDefault(updateUser_schema_1).default; } });

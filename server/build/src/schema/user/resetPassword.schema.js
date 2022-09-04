"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const passwordRegex = /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
const passwordResetSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        password: (0, zod_1.string)({ required_error: 'Password is required' }).regex(passwordRegex, 'Password is required\n, The password length must be greater than or equal to 8,\n The password must contain one or more uppercase characters,\n The password must contain one or more lowercase characters,\n The password must contain one or more numeric values,\n The password must contain one or more special characters\n'),
        confirmPassword: (0, zod_1.string)({
            required_error: 'passwordConfirmation is required'
        })
    }).refine(data => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword']
    })
});
exports.default = passwordResetSchema;

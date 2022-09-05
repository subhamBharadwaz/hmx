"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const loginUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        email: (0, zod_1.string)({
            required_error: 'Email is required'
        }).email('Not a valid email'),
        password: (0, zod_1.string)({ required_error: 'Password is required' })
    })
});
exports.default = loginUserSchema;

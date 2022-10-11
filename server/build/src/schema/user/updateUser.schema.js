"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const updateUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        firstName: (0, zod_1.string)({ required_error: 'First name is required' }).min(1, 'Must be filled'),
        lastName: (0, zod_1.string)({ required_error: 'Last Name is required' }).min(1, 'Must be filled'),
        email: (0, zod_1.string)({ required_error: 'Email is required' })
            .email('Not a valid email')
            .min(1, 'Must be filled')
    })
});
exports.default = updateUserSchema;

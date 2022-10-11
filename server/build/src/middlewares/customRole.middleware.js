"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../utils/index");
const customRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            const logErr = new index_1.CustomError('You are not allowed for this resource', 403);
            index_1.logger.error(logErr);
            return next(logErr);
        }
        next();
    };
};
exports.default = customRole;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const index_1 = require("./index");
const isValidMongooseObjectId = (id, next) => {
    if (!(0, mongoose_1.isValidObjectId)(id)) {
        const logErr = new index_1.CustomError(`${id} is not a valid id`, 400);
        index_1.logger.error(logErr);
        return next(logErr);
    }
};
exports.default = isValidMongooseObjectId;

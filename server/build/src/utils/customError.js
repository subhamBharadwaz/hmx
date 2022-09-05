"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomError extends Error {
    constructor(message, httpCode) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.httpCode = httpCode;
        Error.captureStackTrace(this);
    }
}
exports.default = CustomError;

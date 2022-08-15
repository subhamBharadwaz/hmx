"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateResource = exports.isLoggedIn = exports.customRole = exports.BigPromise = void 0;
var bigPromise_middleware_1 = require("./bigPromise.middleware");
Object.defineProperty(exports, "BigPromise", { enumerable: true, get: function () { return __importDefault(bigPromise_middleware_1).default; } });
var customRole_middleware_1 = require("./customRole.middleware");
Object.defineProperty(exports, "customRole", { enumerable: true, get: function () { return __importDefault(customRole_middleware_1).default; } });
var isLoggedIn_middleware_1 = require("./isLoggedIn.middleware");
Object.defineProperty(exports, "isLoggedIn", { enumerable: true, get: function () { return __importDefault(isLoggedIn_middleware_1).default; } });
var validateResource_middleware_1 = require("./validateResource.middleware");
Object.defineProperty(exports, "validateResource", { enumerable: true, get: function () { return __importDefault(validateResource_middleware_1).default; } });

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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const user_model_1 = __importDefault(require("../models/user.model"));
const index_1 = require("../utils/index");
const index_2 = require("./index");
let logErr;
const isLoggedIn = (0, index_2.BigPromise)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = req.cookies.token || ((_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', ''));
    if (!token) {
        logErr = new index_1.CustomError('Login first to access this page', 401);
        return next(index_1.logger.error(logErr));
    }
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.get('jwtSecret'));
    req.user = yield user_model_1.default.findById(decoded.id);
    next();
}));
exports.default = isLoggedIn;

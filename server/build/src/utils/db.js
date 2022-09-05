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
exports.disconnectFromDatabase = void 0;
const config_1 = __importDefault(require("config"));
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = require("./index");
const connectToDB = () => {
    const dbUrl = config_1.default.get('dbUrl');
    mongoose_1.default
        .connect(dbUrl)
        .then(() => index_1.logger.info(`DB GOT CONNECTED`))
        .catch(err => {
        index_1.logger.error(`DB Connection Issue , ${err}`);
        process.exit(1);
    });
};
exports.default = connectToDB;
function disconnectFromDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close();
        index_1.logger.info('Disconnected from database');
        return;
    });
}
exports.disconnectFromDatabase = disconnectFromDatabase;

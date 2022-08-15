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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config_1 = __importDefault(require("config"));
const cloudinary_1 = require("cloudinary");
const app_1 = __importDefault(require("./app"));
const index_1 = require("./utils/index");
const db_1 = require("./utils/db");
(0, index_1.connectToDB)();
cloudinary_1.v2.config({
    cloud_name: config_1.default.get('cloudinaryName'),
    api_key: config_1.default.get('cloudinaryApiKey'),
    api_secret: config_1.default.get('cloudinaryApiSecret')
});
const PORT = config_1.default.get('port');
const server = app_1.default.listen(PORT, () => {
    index_1.logger.info(`Server is running at http://localhost:${PORT}`);
    index_1.logger.info(`Docs are at http://localhost:${PORT}/api-docs`);
});
const signals = ['SIGTERM', 'SIGINT'];
function gracefulShutdown(signal) {
    process.on(signal, () => __awaiter(this, void 0, void 0, function* () {
        server.close();
        yield (0, db_1.disconnectFromDatabase)();
        index_1.logger.info('Goodbye, got signal', signal);
        process.exit(0);
    }));
}
for (let i = 0; i < signals.length; i++) {
    gracefulShutdown(signals[i]);
}

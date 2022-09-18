"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const express_pino_logger_1 = __importDefault(require("express-pino-logger"));
const helmet_1 = __importDefault(require("helmet"));
const index_1 = require("./utils/index");
const user_route_1 = __importDefault(require("./routes/user.route"));
const product_route_1 = __importDefault(require("./routes/product.route"));
const payment_route_1 = __importDefault(require("./routes/payment.route"));
const order_route_1 = __importDefault(require("./routes/order.route"));
const app = (0, express_1.default)();
const swaggerDocument = yamljs_1.default.load(`${__dirname}/swagger.yaml`);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_fileupload_1.default)({
    useTempFiles: true,
    tempFileDir: '/temp/'
}));
app.use((0, express_pino_logger_1.default)({
    logger: index_1.logger,
    serializers: {
        req: req => ({
            method: req.method,
            url: req.url,
            user: req.raw.user
        })
    }
}));
app.use((0, helmet_1.default)());
app.use('/api/v1', user_route_1.default);
app.use('/api/v1', product_route_1.default);
app.use('/api/v1', payment_route_1.default);
app.use('/api/v1', order_route_1.default);
process.on('unhandledRejection', (reason) => {
    throw reason;
});
process.on('uncaughtException', err => {
    index_1.logger.error('There was an uncaught error', err);
    process.exit(1);
});
exports.default = app;

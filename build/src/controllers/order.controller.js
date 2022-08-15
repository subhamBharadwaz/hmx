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
exports.adminDeleteSingleOrder = exports.adminUpdateSingleOrder = exports.adminGetAllOrders = exports.getLoggedInUserOrders = exports.getSingleOrder = exports.createOrder = void 0;
const order_model_1 = __importDefault(require("../models/order.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const index_1 = require("../middlewares/index");
const index_2 = require("../utils/index");
let logErr;
exports.createOrder = (0, index_1.BigPromise)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { shippingInfo, orderItems, paymentInfo, taxAmount, shippingAmount, totalAmount, orderStatus } = req.body;
    if (!shippingInfo ||
        !orderItems ||
        !paymentInfo ||
        !taxAmount ||
        !shippingAmount ||
        !totalAmount) {
        logErr = new index_2.CustomError(`All required fields must be filled`, 401);
        index_2.logger.error(logErr);
        return next(logErr);
    }
    const userId = req.user._id;
    (0, index_2.isValidMongooseObjectId)(userId, next);
    const order = yield order_model_1.default.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        taxAmount,
        shippingAmount,
        totalAmount,
        orderStatus,
        user: userId
    });
    res.status(200).json({
        success: true,
        order
    });
}));
exports.getSingleOrder = (0, index_1.BigPromise)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    (0, index_2.isValidMongooseObjectId)(orderId, next);
    const order = yield order_model_1.default.findById(orderId).populate('user', 'name email');
    if (!order) {
        logErr = new index_2.CustomError(`Please check order id`, 401);
        index_2.logger.error(logErr);
        return next(logErr);
    }
    res.status(200).json({ success: true, order });
}));
exports.getLoggedInUserOrders = (0, index_1.BigPromise)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    (0, index_2.isValidMongooseObjectId)(userId, next);
    const order = yield order_model_1.default.find({ user: userId });
    if (!order) {
        logErr = new index_2.CustomError(`Please check order id`, 401);
        index_2.logger.error(logErr);
        return next(logErr);
    }
    res.status(200).json({ success: true, order });
}));
exports.adminGetAllOrders = (0, index_1.BigPromise)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield order_model_1.default.find();
    res.status(200).json({ success: true, orders });
}));
exports.adminUpdateSingleOrder = (0, index_1.BigPromise)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    (0, index_2.isValidMongooseObjectId)(orderId, next);
    const order = yield order_model_1.default.findById(orderId);
    if ((order === null || order === void 0 ? void 0 : order.orderStatus) === 'Delivered') {
        logErr = new index_2.CustomError(`Order is already marked for delivered`, 401);
        index_2.logger.error(logErr);
        return next(logErr);
    }
    if (order !== null) {
        order.orderStatus = req.body.orderStatus;
    }
    order === null || order === void 0 ? void 0 : order.orderItems.forEach((prod) => __awaiter(void 0, void 0, void 0, function* () {
        yield updateProductStock(prod.product, prod.quantity);
    }));
    yield (order === null || order === void 0 ? void 0 : order.save());
    res.status(200).json({ success: true, order });
}));
exports.adminDeleteSingleOrder = (0, index_1.BigPromise)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    (0, index_2.isValidMongooseObjectId)(orderId, next);
    const order = yield order_model_1.default.findById(orderId);
    if (!order) {
        logErr = new index_2.CustomError(`Order is not found with the id ${orderId}`, 400);
        index_2.logger.error(logErr);
        return next(logErr);
    }
    yield order.remove();
    res.status(201).json({ success: true, message: 'Order is successfully deleted' });
}));
function updateProductStock(productId, quantity) {
    return __awaiter(this, void 0, void 0, function* () {
        const product = yield product_model_1.default.findById(productId);
        if (product !== null) {
            product.stock -= quantity;
        }
        yield (product === null || product === void 0 ? void 0 : product.save({ validateBeforeSave: false }));
    });
}

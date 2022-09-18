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
exports.captureRazorpayPayment = exports.sendRazorpayKey = exports.captureStripePayment = exports.sendStripeKey = void 0;
const config_1 = __importDefault(require("config"));
const stripe_1 = __importDefault(require("stripe"));
const razorpay_1 = __importDefault(require("razorpay"));
const nanoid_1 = require("nanoid");
const index_1 = require("../middlewares/index");
const stripe = new stripe_1.default(config_1.default.get('stripeApiSecret'), { apiVersion: '2020-08-27' });
exports.sendStripeKey = (0, index_1.BigPromise)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({
        stripeApiKey: config_1.default.get('stripeApiKey')
    });
}));
exports.captureStripePayment = (0, index_1.BigPromise)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentIntent = yield stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'inr',
        metadata: { integration_check: 'accept_a_payment' }
    });
    res.status(200).json({
        success: true,
        client_secret: paymentIntent.client_secret,
        id: (0, nanoid_1.nanoid)()
    });
}));
exports.sendRazorpayKey = (0, index_1.BigPromise)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({
        stripeApiKey: config_1.default.get('razorpayApiKey')
    });
}));
exports.captureRazorpayPayment = (0, index_1.BigPromise)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const instance = new razorpay_1.default({
        key_id: config_1.default.get('razorpayApiKey'),
        key_secret: config_1.default.get('razorpayApiSecret')
    });
    const options = {
        amount: req.body.amount,
        currency: 'INR',
        receipt: `receipt#${(0, nanoid_1.nanoid)()}`
    };
    const myOrder = yield instance.orders.create(options);
    res.status(200).json({
        success: true,
        amount: req.body.amount,
        order: myOrder
    });
}));

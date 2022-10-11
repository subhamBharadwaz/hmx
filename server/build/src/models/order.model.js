"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const types_order_1 = require("../types/types.order");
const OrderSchema = new mongoose_1.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        phoneNo: {
            type: String,
            required: true
        },
        postalCode: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        }
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [
        {
            name: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            image: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            product: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            }
        }
    ],
    paymentInfo: {
        id: {
            type: String
        }
    },
    taxAmount: {
        type: Number,
        required: true
    },
    shippingAmount: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        required: true,
        enum: {
            values: Object.values(types_order_1.OrderStatusType)
        }
    },
    deliveredAt: {
        type: Date
    }
}, {
    timestamps: true
});
const OrderModel = (0, mongoose_1.model)('Order', OrderSchema);
exports.default = OrderModel;

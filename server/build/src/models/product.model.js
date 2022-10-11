"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const types_product_1 = require("../types/types.product");
const ProductSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name of the product'],
        trim: true
    },
    price: {
        type: String,
        required: [true, 'Please provide price of the product']
    },
    description: {
        type: String,
        required: [true, 'Please provide a description of the product']
    },
    photos: [
        {
            id: {
                type: String,
                required: true
            },
            secure_url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, 'Please select a category for the product'],
        enum: {
            values: Object.values(types_product_1.CategoryType),
            message: `Please select category only from - ${types_product_1.CategoryType.Men} or ${types_product_1.CategoryType.Women}`
        }
    },
    productType: {
        type: String,
        required: [true, 'Please select type of the product'],
        enum: {
            values: Object.values(types_product_1.ProductType),
            message: `Please select the type of the product only from the given types`
        }
    },
    brand: {
        type: String,
        required: [true, 'Please ad a brand for the product']
    },
    stock: {
        type: Number,
        default: 0
    },
    size: {
        type: String,
        required: [true, 'Please select the available sizes for the product'],
        enum: {
            values: Object.values(types_product_1.SizeType),
            message: `Please select sized only from the given sizes,`
        }
    },
    ratings: {
        type: Number,
        default: 0
    },
    numberOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            name: {
                type: String
            },
            rating: {
                type: Number,
                required: true,
                enum: {
                    values: Object.values(types_product_1.RatingType),
                    message: `Please select rating only from 0-5`
                }
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});
const ProductModel = (0, mongoose_1.model)('Product', ProductSchema);
exports.default = ProductModel;

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
exports.adminDeleteSingleProduct = exports.adminUpdateSingleProduct = exports.adminAddProduct = exports.adminGetAllProducts = exports.getSingleProductReviews = exports.deleteReview = exports.addReview = exports.getSingleProduct = exports.getAllProducts = void 0;
const cloudinary_1 = require("cloudinary");
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("config"));
const product_model_1 = __importDefault(require("../models/product.model"));
const index_1 = require("../middlewares/index");
const index_2 = require("../utils/index");
let logErr;
exports.getAllProducts = (0, index_1.BigPromise)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resultPerPage = 6;
    const productCount = yield product_model_1.default.countDocuments();
    const productsObj = new index_2.WhereClause(product_model_1.default.find(), req.query).search().filter();
    let products = yield productsObj.base;
    const filteredProductNumber = products.length;
    productsObj.pager(resultPerPage);
    products = yield productsObj.base.clone();
    res.status(200).json({
        success: true,
        products,
        filteredProductNumber,
        productCount
    });
}));
exports.getSingleProduct = (0, index_1.BigPromise)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    (0, index_2.isValidMongooseObjectId)(id, next);
    const product = yield product_model_1.default.findById(id);
    if (!product) {
        logErr = new index_2.CustomError(`No product found, please correct the data and try again`, 400);
        index_2.logger.error(logErr);
        return next(logErr);
    }
    res.status(200).json({ success: true, product });
}));
exports.addReview = (0, index_1.BigPromise)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { rating, comment, productId } = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    };
    (0, index_2.isValidMongooseObjectId)(productId, next);
    const product = yield product_model_1.default.findById(productId);
    const AlreadyReviewed = product === null || product === void 0 ? void 0 : product.reviews.find(rev => rev.user.toString() === req.user._id.toString());
    if (AlreadyReviewed) {
        product === null || product === void 0 ? void 0 : product.reviews.forEach(rev => {
            if (rev.user.toString() === req.user._id.toString()) {
                rev.comment = comment;
                rev.rating = rating;
            }
        });
    }
    else {
        product === null || product === void 0 ? void 0 : product.reviews.push(review);
        if (product)
            product.numberOfReviews = product.reviews.length;
    }
    if (product) {
        product.ratings =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
                product.reviews.length;
    }
    yield (product === null || product === void 0 ? void 0 : product.save({ validateBeforeSave: false }));
    res.status(200).json({ success: true });
}));
exports.deleteReview = (0, index_1.BigPromise)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.query;
    const product = yield product_model_1.default.findById(productId);
    const reviews = product === null || product === void 0 ? void 0 : product.reviews.filter(rev => rev.user.toString() !== req.user._id.toString());
    const numberOfReviews = reviews === null || reviews === void 0 ? void 0 : reviews.length;
    let ratings = product === null || product === void 0 ? void 0 : product.ratings;
    if (reviews) {
        ratings = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    }
    yield product_model_1.default.findByIdAndUpdate(productId, {
        reviews,
        ratings,
        name: req.user.name,
        numberOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({ success: true });
}));
exports.getSingleProductReviews = (0, index_1.BigPromise)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.default.findById(req.query.id);
    res.status(200).json({ success: true, reviews: product === null || product === void 0 ? void 0 : product.reviews });
}));
exports.adminGetAllProducts = (0, index_1.BigPromise)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield product_model_1.default.find();
    res.status(200).json({ success: true, products });
}));
exports.adminAddProduct = (0, index_1.BigPromise)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const imageArr = [];
    if (!req.files) {
        logErr = new index_2.CustomError('Images are required', 401);
        index_2.logger.error(logErr);
        return next(logErr);
    }
    if (req.files) {
        const images = req.files.photos;
        const allowedExtensions = ['.png', '.jpg', '.jpeg'];
        for (let i = 0; i < images.length; i += 1) {
            const extensionName = path_1.default.extname(images[i].name);
            if (!allowedExtensions.includes(extensionName)) {
                logErr = new index_2.CustomError('Invalid Image', 422);
                index_2.logger.error(logErr);
                return next(logErr);
            }
        }
        for (let i = 0; i < images.length; i += 1) {
            const result = yield cloudinary_1.v2.uploader.upload(images[i].tempFilePath, {
                folder: config_1.default.get('productImageDir')
            });
            imageArr.push({
                id: result.public_id,
                secure_url: result.secure_url
            });
        }
        req.body.photos = imageArr;
    }
    req.body.user = req.user.id;
    const product = yield product_model_1.default.create(req.body);
    res.status(201).json({ success: true, product });
}));
exports.adminUpdateSingleProduct = (0, index_1.BigPromise)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    (0, index_2.isValidMongooseObjectId)(id, next);
    let product = yield product_model_1.default.findById(id);
    if (!product) {
        logErr = new index_2.CustomError(`No product found with the id of ${id}`, 400);
        index_2.logger.error(logErr);
        return next(logErr);
    }
    const imageArr = [];
    if (req.files) {
        for (let i = 0; i < product.photos.length; i += 1) {
            yield cloudinary_1.v2.uploader.destroy(product.photos[i].id);
        }
        const images = req.files.photos;
        const allowedExtensions = ['.png', '.jpg', '.jpeg'];
        for (let i = 0; i < images.length; i += 1) {
            const extensionName = path_1.default.extname(images[i].name);
            if (!allowedExtensions.includes(extensionName)) {
                logErr = new index_2.CustomError('Invalid Image', 422);
                index_2.logger.error(logErr);
                return next(logErr);
            }
        }
        for (let i = 0; i < images.length; i += 1) {
            const result = yield cloudinary_1.v2.uploader.upload(images[i].tempFilePath, {
                folder: config_1.default.get('productImageDir')
            });
            imageArr.push({
                id: result.public_id,
                secure_url: result.secure_url
            });
        }
        req.body.photos = imageArr;
    }
    product = yield product_model_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(201).json({ success: true, product });
}));
exports.adminDeleteSingleProduct = (0, index_1.BigPromise)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    (0, index_2.isValidMongooseObjectId)(id, next);
    const product = yield product_model_1.default.findById(id);
    if (!product) {
        logErr = new index_2.CustomError(`No product found with the id of ${id}`, 400);
        index_2.logger.error(logErr);
        return next(logErr);
    }
    for (let i = 0; i < product.photos.length; i += 1) {
        yield cloudinary_1.v2.uploader.destroy(product.photos[i].id);
    }
    yield product.remove();
    res.status(202).json({ success: true, message: 'Product deleted successfully' });
}));

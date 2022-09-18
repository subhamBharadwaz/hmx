"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("../middlewares/index");
const product_1 = require("../schema/product");
const product_controller_1 = require("../controllers/product.controller");
const router = (0, express_1.Router)();
router.route('/products').get(product_controller_1.getAllProducts);
router.route('/product/:id').get(product_controller_1.getSingleProduct);
router
    .route('/review')
    .put(index_1.isLoggedIn, (0, index_1.validateResource)(product_1.addProductReview), product_controller_1.addReview)
    .delete(index_1.isLoggedIn, product_controller_1.deleteReview);
router.route('/reviews').get(product_controller_1.getSingleProductReviews);
router.route('/admin/products').get(index_1.isLoggedIn, (0, index_1.customRole)('admin'), product_controller_1.adminGetAllProducts);
router
    .route('/admin/product/add')
    .post(index_1.isLoggedIn, (0, index_1.customRole)('admin'), (0, index_1.validateResource)(product_1.addProductSchema), product_controller_1.adminAddProduct);
router
    .route('/admin/product/:id')
    .put(index_1.isLoggedIn, (0, index_1.customRole)('admin'), (0, index_1.validateResource)(product_1.addProductSchema), product_controller_1.adminUpdateSingleProduct)
    .delete(index_1.isLoggedIn, (0, index_1.customRole)('admin'), product_controller_1.adminDeleteSingleProduct);
exports.default = router;

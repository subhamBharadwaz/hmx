"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("../middlewares/index");
const index_2 = require("../schema/order/index");
const order_controller_1 = require("../controllers/order.controller");
const router = (0, express_1.Router)();
router.route('/order/create').post(index_1.isLoggedIn, (0, index_1.validateResource)(index_2.createOrderSchema), order_controller_1.createOrder);
router.route('/order/:id').get(index_1.isLoggedIn, order_controller_1.getSingleOrder);
router.route('/myorder').get(index_1.isLoggedIn, order_controller_1.getLoggedInUserOrders);
router.route('/admin/orders').get(index_1.isLoggedIn, (0, index_1.customRole)('admin'), order_controller_1.adminGetAllOrders);
router.route('/admin/order/:id').put(index_1.isLoggedIn, (0, index_1.customRole)('admin'), order_controller_1.adminUpdateSingleOrder);
router.route('/admin/order/:id').delete(index_1.isLoggedIn, (0, index_1.customRole)('admin'), order_controller_1.adminDeleteSingleOrder);
exports.default = router;

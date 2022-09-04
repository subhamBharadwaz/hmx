"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("../middlewares/index");
const user_1 = require("../schema/user");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
router.route('/register').post((0, index_1.validateResource)(user_1.registerUserSchema), user_controller_1.register);
router.route('/login').post((0, index_1.validateResource)(user_1.loginUserSchema), user_controller_1.login);
router.route('/logout').get(user_controller_1.logout);
router.route('/forgotpassword').post((0, index_1.validateResource)(user_1.forgotPasswordSchema), user_controller_1.forgotPassword);
router.route('/password/reset/:token').post((0, index_1.validateResource)(user_1.passwordResetSchema), user_controller_1.passwordReset);
router.route('/userdashboard').get(index_1.isLoggedIn, user_controller_1.getUser);
router
    .route('/password/update')
    .put(index_1.isLoggedIn, (0, index_1.validateResource)(user_1.changePasswordSchema), user_controller_1.changePassword);
router
    .route('/userdashboard/update')
    .put(index_1.isLoggedIn, (0, index_1.validateResource)(user_1.updateUserSchema), user_controller_1.updateUserDetails);
router.route('/admin/users').get(index_1.isLoggedIn, (0, index_1.customRole)('admin'), user_controller_1.adminAllUsers);
router
    .route('/admin/user/:id')
    .get(index_1.isLoggedIn, (0, index_1.customRole)('admin'), user_controller_1.adminSingleUser)
    .put(index_1.isLoggedIn, (0, index_1.customRole)('admin'), user_controller_1.adminUpdateUserDetails)
    .delete(index_1.isLoggedIn, (0, index_1.customRole)('admin'), user_controller_1.adminDeleteUser);
exports.default = router;

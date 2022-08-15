import {Router} from 'express';

// import middleware
import {isLoggedIn, validateResource, customRole} from '../middlewares/index';

// import input schema validation
import {
	registerUserSchema,
	loginUserSchema,
	forgotPasswordSchema,
	passwordResetSchema,
	changePasswordSchema,
	updateUserSchema
} from '../schema/user';

// import controllers
import {
	register,
	login,
	logout,
	forgotPassword,
	passwordReset,
	getUser,
	changePassword,
	updateUserDetails,
	adminAllUsers,
	adminSingleUser,
	adminUpdateUserDetails,
	adminDeleteUser
} from '../controllers/user.controller';

const router = Router();

router.route('/register').post(validateResource(registerUserSchema), register);
router.route('/login').post(validateResource(loginUserSchema), login);
router.route('/logout').get(logout);
router.route('/forgotpassword').post(validateResource(forgotPasswordSchema), forgotPassword);
router.route('/password/reset/:token').post(validateResource(passwordResetSchema), passwordReset);
router.route('/userdashboard').get(isLoggedIn, getUser);
router
	.route('/password/update')
	.put(isLoggedIn, validateResource(changePasswordSchema), changePassword);
router
	.route('/userdashboard/update')
	.put(isLoggedIn, validateResource(updateUserSchema), updateUserDetails);

// admin only routes
router.route('/admin/users').get(isLoggedIn, customRole('admin'), adminAllUsers);
router
	.route('/admin/user/:id')
	.get(isLoggedIn, customRole('admin'), adminSingleUser)
	.put(isLoggedIn, customRole('admin'), adminUpdateUserDetails)
	.delete(isLoggedIn, customRole('admin'), adminDeleteUser);

export default router;

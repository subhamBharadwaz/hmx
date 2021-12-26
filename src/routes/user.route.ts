import {Router} from 'express';

// import middleware
import isLoggedIn from '@middleware/user.middleware';
import validateResource from '@middleware/validateResource';

// schema
import {
	registerUserSchema,
	loginUserSchema,
	forgotPasswordSchema,
	passwordResetSchema,
	changePasswordSchema,
	updateUserSchema
} from '@src/schema/user';

// import controllers
import {
	register,
	login,
	logout,
	forgotPassword,
	passwordReset,
	getUser,
	changePassword,
	updateUserDetails
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
	.post(isLoggedIn, validateResource(changePasswordSchema), changePassword);
router
	.route('/userdashboard/update')
	.post(isLoggedIn, validateResource(updateUserSchema), updateUserDetails);

export default router;

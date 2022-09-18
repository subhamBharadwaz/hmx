import {Router} from 'express';

// import middleware
import {isLoggedIn, validateResource, customRole} from '../../middlewares';

// import input schema validation
import {
	registerUserSchema,
	loginUserSchema,
	forgotPasswordSchema,
	passwordResetSchema,
	changePasswordSchema,
	updateUserSchema
} from './user.schema';

// import controllers
import {
	registerHandler,
	loginHandler,
	logoutHandler,
	getUserHandler,
	forgotPasswordHandler,
	passwordResetHandler,
	changePasswordHandler,
	updateUserDetailsHandler,
	adminAllUsersHandler,
	adminSingleUserHandler,
	adminUpdateUserDetailsHandler,
	adminDeleteUserHandler
} from './user.controller';

const router = Router();

router.route('/register').post(validateResource(registerUserSchema), registerHandler);
router.route('/login').post(validateResource(loginUserSchema), loginHandler);
router.route('/logout').get(logoutHandler);
router.route('/forgotpassword').post(validateResource(forgotPasswordSchema), forgotPasswordHandler);
router
	.route('/password/reset/:token')
	.post(validateResource(passwordResetSchema), passwordResetHandler);
router.route('/userdashboard').get(isLoggedIn, getUserHandler);
router
	.route('/password/update')
	.put(isLoggedIn, validateResource(changePasswordSchema), changePasswordHandler);
router
	.route('/userdashboard/update')
	.put(isLoggedIn, validateResource(updateUserSchema), updateUserDetailsHandler);

// admin only routes
router.route('/admin/users').get(isLoggedIn, customRole('admin'), adminAllUsersHandler);
router
	.route('/admin/user/:id')
	.get(isLoggedIn, customRole('admin'), adminSingleUserHandler)
	.put(isLoggedIn, customRole('admin'), adminUpdateUserDetailsHandler)
	.delete(isLoggedIn, customRole('admin'), adminDeleteUserHandler);

export default router;

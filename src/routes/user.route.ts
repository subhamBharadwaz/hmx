import {Router} from 'express';

// import middleware
import isLoggedIn from '../middlewares/user.middleware';
import validateResource from '../middlewares/validateResource';

// schema
import {createUserSchema} from '../schema/user.schema';

// import controllers
import {
	register,
	login,
	logout,
	forgotPassword,
	passwordReset,
	getUser
} from '../controllers/user.controller';

const router = Router();

router.route('/register').post(validateResource(createUserSchema), register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/forgotpassword').post(forgotPassword);
router.route('/password/reset/:token').post(passwordReset);
router.route('/userdashboard').get(isLoggedIn, getUser);

export default router;

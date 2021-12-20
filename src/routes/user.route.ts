import {Router} from 'express';

// import controllers
import {register, login, logout, forgotPassword} from '../controllers/user.controller';

const router = Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/forgotpassword').post(forgotPassword);

export default router;

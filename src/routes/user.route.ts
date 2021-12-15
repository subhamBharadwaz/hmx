import {Router} from 'express';

// import controllers
import {signup} from '../controllers/user.controller';

const router = Router();

router.route('/signup').post(signup);

export default router;

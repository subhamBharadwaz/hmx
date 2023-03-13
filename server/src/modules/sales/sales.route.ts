import {Router} from 'express';

// import middleware
import {isLoggedIn, customRole} from '../../middlewares';

// import controllers
import {getSalesDataHandler} from './sales.controller';

const router = Router();

router.route('/sales/:year/:month').get(isLoggedIn, customRole('admin'), getSalesDataHandler);

export default router;

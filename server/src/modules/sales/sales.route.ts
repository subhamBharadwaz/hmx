import {Router} from 'express';

// import middleware
import {isLoggedIn, customRole} from '../../middlewares';

// import controllers
import {getSalesDataHandler, getSalesByStates} from './sales.controller';

const router = Router();

router.route('/sales/:year/:month').get(isLoggedIn, customRole('admin'), getSalesDataHandler);
router.route('/sales/state').get(isLoggedIn, customRole('admin'), getSalesByStates);

export default router;

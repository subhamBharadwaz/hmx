import {Router} from 'express';

// import middleware
import {isLoggedIn, customRole} from '../../middlewares';

// import controllers
import {handleGetSalesDataHandler, handleGetSalesByStates} from './sales.controller';

const router = Router();

router.route('/sales/:year/:month').get(isLoggedIn, customRole('admin'), handleGetSalesDataHandler);
router.route('/sales/state').get(isLoggedIn, customRole('admin'), handleGetSalesByStates);

export default router;

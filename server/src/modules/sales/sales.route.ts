import {Router} from 'express';

// import middleware
import {isLoggedIn, customRole} from '../../middlewares';

// import controllers
import {handleAdminGetSalesDataHandler, handleAdminGetSalesByStates} from './sales.controller';

const router = Router();

router
	.route('/admin/sales/:year/:month')
	.get(isLoggedIn, customRole('admin'), handleAdminGetSalesDataHandler);
router
	.route('/admin/sales/state')
	.get(isLoggedIn, customRole('admin'), handleAdminGetSalesByStates);

export default router;

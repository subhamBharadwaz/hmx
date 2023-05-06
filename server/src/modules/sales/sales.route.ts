import {Router} from 'express';

// import middleware
import {isLoggedIn, customRole} from '../../middlewares';

// import controllers
import {
	handleAdminGetSalesDataHandler,
	handleAdminGetSalesByStates,
	handleAdminGetTotalSalesHandler
} from './sales.controller';

const router = Router();

router
	.route('/admin/sales/:year/:month')
	.get(isLoggedIn, customRole('admin'), handleAdminGetSalesDataHandler);
router
	.route('/admin/sales/state')
	.get(isLoggedIn, customRole('admin'), handleAdminGetSalesByStates);

router
	.route('/admin/sales/total')
	.get(isLoggedIn, customRole('admin'), handleAdminGetTotalSalesHandler);

export default router;

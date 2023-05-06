import {Router} from 'express';

// import middleware
import {isLoggedIn, customRole, validateResource} from '../../middlewares';

// import input schema validation
import {createOrderSchema} from './order.schema';

// import controllers
import {
	createOrderHandler,
	getSingleOrderHandler,
	getLoggedInUserOrdersHandler,
	adminGetAllOrdersHandler,
	adminCountTotalOrdersHandler,
	adminUpdateSingleOrderHandler,
	adminDeleteSingleOrderHandler,
	adminGetSingleOrderHandler,
	adminGetAllDeliveredOrdersHandler,
	adminGetRecentOrdersHandler
} from './order.controller';

const router = Router();

router
	.route('/order/create')
	.post(isLoggedIn, validateResource(createOrderSchema), createOrderHandler);

router.route('/order/:id').get(isLoggedIn, getSingleOrderHandler);
// ? ORDERING Routes matters
/** if we place /order/:id before /order/myorder, whenever /order/myorder route hits, it will require an id.
 * Since myorder is simply a get route we can define it /myorder instead of /order/myorder */

/**
 * //?
 * Whatever the routes that expecting a id, place them at the very end so all the above things are evaluated
 */
router.route('/myorder').get(isLoggedIn, getLoggedInUserOrdersHandler); // ex: http://localhost:4000/myorder

// Admin only routes
router.route('/admin/orders').get(isLoggedIn, customRole('admin'), adminGetAllOrdersHandler);
router
	.route('/admin/orders/total')
	.get(isLoggedIn, customRole('admin'), adminCountTotalOrdersHandler);
router
	.route('/admin/orders/recent')
	.get(isLoggedIn, customRole('admin'), adminGetRecentOrdersHandler);
router
	.route('/admin/orders/total-delivered-orders')
	.get(isLoggedIn, customRole('admin'), adminGetAllDeliveredOrdersHandler);
router
	.route('/admin/orders/:id')
	.get(isLoggedIn, customRole('admin'), adminGetSingleOrderHandler)
	.put(isLoggedIn, customRole('admin'), adminUpdateSingleOrderHandler);
router
	.route('/admin/orders/:id')
	.delete(isLoggedIn, customRole('admin'), adminDeleteSingleOrderHandler);

export default router;

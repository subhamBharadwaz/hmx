import {Router} from 'express';

// import middleware
import {isLoggedIn, customRole, validateResource} from '../middlewares/index';

// import input schema validation
import {createOrderSchema} from '../schema/order/index';

// import controllers
import {
	createOrder,
	getSingleOrder,
	getLoggedInUserOrders,
	adminGetAllOrders,
	adminUpdateSingleOrder,
	adminDeleteSingleOrder
} from '../controllers/order.controller';

const router = Router();

router.route('/order/create').post(isLoggedIn, validateResource(createOrderSchema), createOrder);

router.route('/order/:id').get(isLoggedIn, getSingleOrder);
// ? ORDERING Routes matters
/** if we place /order/:id before /order/myorder, whenever /order/myorder route hits, it will require an id.
 * Since myorder is simply a get route we can define it /myorder instead of /order/myorder */

/**
 * //?
 * Whatever the routes that expecting a id, place them at the very end so all the above things are evaluated
 */
router.route('/myorder').get(isLoggedIn, getLoggedInUserOrders);

// Admin only routes
router.route('/admin/orders').get(isLoggedIn, customRole('admin'), adminGetAllOrders);
router.route('/admin/order/:id').put(isLoggedIn, customRole('admin'), adminUpdateSingleOrder);
router.route('/admin/order/:id').delete(isLoggedIn, customRole('admin'), adminDeleteSingleOrder);

export default router;

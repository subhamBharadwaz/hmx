import {Router} from 'express';

// import middleware
import {isLoggedIn, validateResource} from '../../middlewares';

// import input schema validation
import {createBagSchema} from './bag.schema';

// import controllers
import {getBagHandler, createBagHandler, deleteBagProductHandler} from './bag.controller';

const router = Router();

router
	.route('/bag')
	.get(isLoggedIn, getBagHandler)
	.put(isLoggedIn, validateResource(createBagSchema), createBagHandler);
router.route('/bag/:productId').delete(isLoggedIn, deleteBagProductHandler);

export default router;

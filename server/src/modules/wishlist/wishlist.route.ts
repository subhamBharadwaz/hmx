import {Router} from 'express';

// import middleware
import {isLoggedIn} from '../../middlewares';

// import controllers
import {
	getWishlistHandler,
	createWishlistHandler,
	deleteWIshlistHandler
} from './wishlist.controller';

const router = Router();

router
	.route('/wishlist')
	.get(isLoggedIn, getWishlistHandler)
	.put(isLoggedIn, createWishlistHandler);
router.route('/wishlist/:productId').delete(isLoggedIn, deleteWIshlistHandler);

export default router;

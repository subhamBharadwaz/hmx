import {Router} from 'express';

// import middleware
import {isLoggedIn, customRole, validateResource} from '../../middlewares';

// import input schema validation
import {addProductSchema, addProductReview} from './product.schema';
// import controllers
import {
	getAllProductsHandler,
	getSingleProductHandler,
	addReviewHandler,
	deleteReviewHandler,
	getSingleProductReviewsHandler,
	adminGetAllProductsHandler,
	adminGetSingleProductsHandler,
	adminAddProductHandler,
	adminUpdateSingleProductHandler,
	adminDeleteSingleProductHandler,
	handleGetToSellingProducts
} from './product.controller';

const router = Router();

router.route('/products').get(getAllProductsHandler);
router.route('/product/:id').get(getSingleProductHandler);

router
	.route('/review')
	.put(isLoggedIn, validateResource(addProductReview), addReviewHandler)
	.delete(isLoggedIn, deleteReviewHandler);
router.route('/reviews').get(getSingleProductReviewsHandler);
router.route('/top-selling').get(handleGetToSellingProducts);

// admin only routes
router.route('/admin/products').get(isLoggedIn, customRole('admin'), adminGetAllProductsHandler);
router
	.route('/admin/product/add')
	.post(
		isLoggedIn,
		customRole('admin'),
		validateResource(addProductSchema),
		adminAddProductHandler
	);

router
	.route('/admin/product/:id')
	.get(isLoggedIn, customRole('admin'), adminGetSingleProductsHandler)
	.put(isLoggedIn, customRole('admin'), adminUpdateSingleProductHandler)
	.delete(isLoggedIn, customRole('admin'), adminDeleteSingleProductHandler);

export default router;

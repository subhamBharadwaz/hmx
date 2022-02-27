import {Router} from 'express';

// import middleware
import {isLoggedIn, customRole, validateResource} from '@middleware/index';

// import input schema validation
import {addProductSchema, addProductReview} from '@schema/product';

// import controllers
import {
	getAllProducts,
	getSingleProduct,
	addReview,
	deleteReview,
	getSingleProductReviews,
	adminGetAllProducts,
	adminAddProduct,
	adminUpdateSingleProduct,
	adminDeleteSingleProduct
} from '@controller/product.controller';

const router = Router();

router.route('/products').get(getAllProducts);
router.route('/product/:id').get(getSingleProduct);

router
	.route('/review')
	.put(isLoggedIn, validateResource(addProductReview), addReview)
	.delete(isLoggedIn, deleteReview);
router.route('/reviews').get(getSingleProductReviews);

// admin only routes
router.route('/admin/products').get(isLoggedIn, customRole('admin'), adminGetAllProducts);
router
	.route('/admin/product/add')
	.post(isLoggedIn, customRole('admin'), validateResource(addProductSchema), adminAddProduct);

router
	.route('/admin/product/:id')
	.put(
		isLoggedIn,
		customRole('admin'),
		validateResource(addProductSchema),
		adminUpdateSingleProduct
	)
	.delete(isLoggedIn, customRole('admin'), adminDeleteSingleProduct);

export default router;

/* eslint-disable no-unused-expressions */

import {Request, Response, NextFunction} from 'express';
import {v2 as cloudinary, UploadApiOptions} from 'cloudinary';
import path from 'path';
import config from 'config';
import {BigPromise} from '../../middlewares';
import {isValidMongooseObjectId, APIError} from '../../utils';
import {IGetUserAuthInfoRequest, IUser} from '../user/user.types';
import {HttpStatusCode} from '../../types/http.model';
import {
	totalProducts,
	findProductById,
	updateProductById,
	addProduct,
	getTopSellingProducts
} from './product.service';
import Product from './product.model';
import {RatingType} from './product.types';

const categoryOptions: string[] = [
	'Twill Jogger',
	'Shirred Jogger',
	'Motoknit Jogger',
	'Dropcrotch Jogger',
	'Hiphop Jogger',
	'Shadingblock Jogger',
	'Chino Jogger',
	'Handcuffed Jogger',
	'Loosepocket Jogger',
	'Splashcolor Jogger',
	'Wool Jogger',
	'Distressed Jogger',
	'Noncuffed Jogger'
];
const genderOptions: string[] = ['Men', 'Women', 'Unisex'];
const sizeOptions: string[] = ['S', 'M', 'L', 'XL', 'XXL'];
type SortOrder = 1 | -1;

export const getAllProductsHandler = BigPromise(async (req: Request, res: Response) => {
	// ? Pagination:
	// * The resultPerPage variable specifies how many results should be returned per page.
	const resultPerPage = 12;

	// * The page and limit variables are retrieved from the request query parameters and default to 1 and 6, respectively
	const {page = 1} = req.query as {page?: string};
	const limit = parseInt(req.query.limit as string, 10) || 12;

	// * Price range
	const minPrice = parseInt(req.query.minPrice as string, 10) || 499;
	const maxPrice = parseInt(req.query.maxPrice as string, 10) || 5999;

	// * he skip variable calculates how many results should be skipped based on the current page and limit, so that the correct set of results is returned for the current page.
	const skip = (Number(page) - 1) * Number(limit);

	const search = req.query.search || '';

	let category = req.query.category || 'All';
	let size = req.query.size || 'All';
	let gender = req.query.gender || 'All';

	category === 'All'
		? (category = [...categoryOptions])
		: (category = (req.query.category as string).split(','));
	gender === 'All'
		? (gender = [...genderOptions])
		: (gender = (req.query.gender as string).split(','));
	size === 'All' ? (size = [...sizeOptions]) : (size = (req.query.size as string).split(','));

	// ? Filtering:
	/**
	 * * This section of the code sets up the filter that will be used to retrieve the products.
	 * * The $or operator specifies that the filter should match documents where the name, category, or gender fields match the regular expression specified by search.
	 * * The $in operator is used to match documents where the category, gender, and size fields are in the arrays specified by category, gender, and size, respectively.
	 */
	const filter = {
		$or: [
			{name: {$regex: search, $options: 'i'}},
			{category: {$regex: search, $options: 'i'}},
			{gender: {$regex: search, $options: 'i'}}
		],
		category: {$in: category},
		gender: {$in: gender},
		size: {$in: size},
		price: {$gte: minPrice, $lte: maxPrice}
	};

	// ? Sorting
	const sortDirection = req.query.sortDirection === 'asc' ? 'asc' : 'desc';
	const sortBy = req.query.sortBy === 'price' ? 'price' : '_id';

	const sort = {};
	if (sortBy === 'price') {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		// eslint-disable-next-line dot-notation
		sort['price'] = sortDirection;
	} else {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		// eslint-disable-next-line dot-notation
		sort['_id'] = sortDirection;
	}

	// ? Retrieving addProductSchema
	/**
	 * * This section of the code retrieves the products from the database using the filter, sortBy, skip, and limit parameters.
	 * * The lean() method is used to return plain JavaScript objects instead of Mongoose documents, which can improve performance.
	 * * The total variable is set by counting the number of documents that match the filter and query parameters.
	 * * The Promise.all() method is used to execute both queries concurrently and return the results as an array.
	 */
	const [products, total] = await Promise.all([
		Product.find(filter).sort(sort).limit(limit).skip(skip).lean(),
		Product.find(filter).countDocuments()
	]);
	const pageCount = Math.ceil(total / resultPerPage);
	const filteredProductCount = await Product.countDocuments(filter);

	res.status(200).json({
		success: true,
		productCount: await totalProducts(),
		total,
		limit,
		page,
		filteredProductCount,
		products,
		pageCount
	});
});

/** 
@desc    Get Products
@route   GET /api/v1/product/:id
@access  Public
*/
export const getSingleProductHandler = BigPromise(
	async (req: Request, res: Response, next: NextFunction) => {
		const {id} = req.params;

		isValidMongooseObjectId(id, next);

		const product = await findProductById(id);

		if (!product) {
			const message = 'No product found, please correct the data and try again.';
			return next(new APIError(message, 'getSingleProductHandler', HttpStatusCode.NOT_FOUND));
		}

		res.status(200).json({success: true, product});
	}
);

/** 
@desc    Get top selling products
@route   GET /api/v1/sales/state
@access  Private
*/
export const handleGetToSellingProducts = BigPromise(async (req: Request, res: Response) => {
	const topSellingProducts = await getTopSellingProducts();

	res.status(200).json({success: true, products: topSellingProducts});
});

/** 
@desc    Add Review
@route   PUT /api/v1/review
@access  Private
*/
export const addReviewHandler = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
		const {rating, comment, productId} = req.body;
		const {firstName, lastName, email, photo}: IUser = req.user;
		const userInfo = {firstName, lastName, email, photo: photo.secure_url};
		const review = {
			user: req.user._id,
			userInfo,
			rating: Number(rating),
			comment: comment && comment,
			date: new Date()
		};
		// check for if the given id is an valid objectId or not
		isValidMongooseObjectId(productId, next);
		const product = await findProductById(productId);

		const AlreadyReviewed = product?.reviews.find(
			// _id is a BSON field so convert it to a string
			rev => rev.user.toString() === req.user._id.toString()
		);

		if (AlreadyReviewed) {
			product?.reviews.forEach(rev => {
				if (rev.user.toString() === req.user._id.toString()) {
					rev.userInfo = userInfo;
					rev.comment = comment && comment;
					rev.rating = rating;
					rev.date = new Date();
				}
			});
		} else {
			product?.reviews.push(review);
			if (product) product.numberOfReviews = product.reviews.length;
		}

		// adjust ratings
		if (product) {
			const ratingsSum = product.reviews.reduce((acc, item) => item.rating + acc, 0);
			const ratingsCount = product.reviews.length;
			const ratingsAverage = (ratingsSum / ratingsCount).toFixed(1);
			product.ratings = parseFloat(ratingsAverage) as RatingType;
		}

		await product?.save({validateBeforeSave: false});

		res.status(200).json({success: true, review});
	}
);

/** 
@desc    Delete Review
@route   DELETE /api/v1/review
@access  Private
*/
export const deleteReviewHandler = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
		const {productId} = req.query;
		if (typeof productId !== 'string') return;

		isValidMongooseObjectId(productId, next);

		const product = await findProductById(productId);

		const reviews = product?.reviews.filter(
			rev => rev.user.toString() !== req.user._id.toString()
		);

		// update total number of reviews
		const numberOfReviews = reviews?.length;

		// adjust ratings
		const ratings =
			numberOfReviews === 0
				? 0
				: // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				  reviews!.reduce((acc, item) => item.rating + acc, 0) / numberOfReviews!;

		// update the product
		await updateProductById(productId, {
			reviews,
			ratings: parseFloat(ratings.toFixed(1)) as RatingType,
			name: req.user.name,
			numberOfReviews
		});

		res.status(200).json({success: true});
	}
);

/** 
@desc    Get reviews for one product
@route   GET /api/v1/reviews
@access  Public
*/
export const getSingleProductReviewsHandler = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response) => {
		const product = await findProductById(req.query.id);

		res.status(200).json({success: true, reviews: product?.reviews ? product?.reviews : []});
	}
);

/** 
@desc    Admin Get All Products
@route   GET /api/v1/admin/products
@access  Private
*/
export const adminGetAllProductsHandler = BigPromise(async (req: Request, res: Response) => {
	// ? Pagination:
	// * The resultPerPage variable specifies how many results should be returned per page.
	const resultPerPage = 10;

	// * The page and limit variables are retrieved from the request query parameters and default to 1 and 6, respectively
	const {page = 1} = req.query as {page?: string};
	const {limit = 6} = req.query as {limit?: string};

	// * he skip variable calculates how many results should be skipped based on the current page and limit, so that the correct set of results is returned for the current page.
	// eslint-disable-next-line radix
	const skip = (Number(parseInt(page as string)) - 1) * Number(parseInt(limit as string));

	const search = req.query.search || '';

	let category = req.query.category || 'All';
	let size = req.query.size || 'All';
	let gender = req.query.gender || 'All';

	category === 'All'
		? (category = [...categoryOptions])
		: (category = (req.query.category as string).split(','));
	gender === 'All'
		? (gender = [...genderOptions])
		: (gender = (req.query.gender as string).split(','));
	size === 'All' ? (size = [...sizeOptions]) : (size = (req.query.size as string).split(','));

	// Sorting:
	// * If sort is not provided, the default sort order is by price
	let sort = req.query.sort || 'price';

	// * If sort is provided, it is split into an array of field and sort order pairs.
	req.query.sort ? (sort = (req.query.sort as string).split(',')) : (sort = [sort as string]);

	// * The sortOrder variable is set based on whether the sort order is ascending or descending
	const sortOrder: SortOrder = typeof sort === 'string' && sort[1] === 'desc' ? -1 : 1;

	// * The sortBy array is constructed based on the sort parameter and sort order.
	const sortBy: [string, SortOrder][] = [];

	if (typeof sort === 'string') {
		sortBy.push([sort, sortOrder]);
	}

	// ? Filtering:
	/**
	 * * This section of the code sets up the filter that will be used to retrieve the products.
	 * * The $or operator specifies that the filter should match documents where the name, category, or gender fields match the regular expression specified by search.
	 * * The $in operator is used to match documents where the category, gender, and size fields are in the arrays specified by category, gender, and size, respectively.
	 */
	const filter = {
		$or: [
			{name: {$regex: search, $options: 'i'}},
			{category: {$regex: search, $options: 'i'}},
			{gender: {$regex: search, $options: 'i'}}
		],
		category: {$in: category},
		gender: {$in: gender},
		size: {$in: size}
	};

	// ? Retrieving addProductSchema
	/**
	 * * This section of the code retrieves the products from the database using the filter, sortBy, skip, and limit parameters.
	 * * The lean() method is used to return plain JavaScript objects instead of Mongoose documents, which can improve performance.
	 * * The total variable is set by counting the number of documents that match the filter and query parameters.
	 * * The Promise.all() method is used to execute both queries concurrently and return the results as an array.
	 */
	const [products, total] = await Promise.all([
		Product.find(filter).sort(sortBy).skip(skip).limit(Number(limit)).lean(),
		Product.countDocuments({category: {$in: category}, name: {$regex: search, $options: 'i'}})
	]);
	const pageCount = Math.ceil(total / resultPerPage);

	res.status(200).json({
		success: true,
		productCount: await totalProducts(),
		total,
		limit,
		page,
		products,
		pageCount
	});
});

/** 
@desc    Get Products
@route   GET /api/v1/product/:id
@access  Public
*/
export const adminGetSingleProductsHandler = BigPromise(
	async (req: Request, res: Response, next: NextFunction) => {
		const {id} = req.params;

		isValidMongooseObjectId(id, next);

		const product = await findProductById(id);

		if (!product) {
			const message = 'No product found, please correct the data and try again.';
			return next(new APIError(message, 'getSingleProductHandler', HttpStatusCode.NOT_FOUND));
		}

		res.status(200).json({success: true, product});
	}
);

/** 
@desc    Admin Add Product
@route   POST /api/v1/product
@access  Private
*/
export const adminAddProductHandler = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
		// images
		const imageArr = [];

		// check whether the images are exists or not
		if (!req.files) {
			const message = 'Images are required.';
			return next(
				new APIError(message, 'adminAddProductHandler', HttpStatusCode.BAD_REQUEST)
			);
		}

		if (req.files) {
			// upload images to cloudinary

			const images: UploadApiOptions = req.files.photos;

			// check if the image is a valid image
			const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp'];

			for (let i = 0; i < images.length; i += 1) {
				// eslint-disable-next-line no-await-in-loop, security/detect-object-injection
				const extensionName = path.extname(images[i].name);

				if (!allowedExtensions.includes(extensionName)) {
					const message = 'Invalid image type.';
					return next(
						new APIError(
							message,
							'adminAddProductHandler',
							HttpStatusCode.UNPROCESSABLE_ENTITY
						)
					);
				}
			}

			for (let i = 0; i < images.length; i += 1) {
				// eslint-disable-next-line no-await-in-loop
				const result = await cloudinary.uploader.upload(images[i].tempFilePath, {
					folder: config.get<string>('productImageDir')
				});

				// pushing the images to imageArr
				imageArr.push({
					id: result.public_id,
					secure_url: result.secure_url
				});
			}
			req.body.photos = imageArr;
		}

		req.body.user = req.user.id;

		const product = await addProduct(req.body);

		res.status(201).json({success: true, product});
	}
);

/** 
@desc    Get total number of products
@route   GET /api/v1/product/:id
@access  Public
*/
export const adminGetTotalNumberOfProductsHandler = BigPromise(
	async (req: Request, res: Response) => {
		const total = await totalProducts();

		res.status(200).json({success: true, total});
	}
);

/** 
@desc    Admin Update Single Product
@route   PUT /api/v1/admin/product/:id
@access  Private
*/
export const adminUpdateSingleProductHandler = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
		const {id} = req.params;

		isValidMongooseObjectId(id, next);

		let product = await findProductById(id);

		if (!product) {
			const message = 'Product not found.';

			return next(
				new APIError(message, 'adminUpdateSingleProductHandler', HttpStatusCode.NOT_FOUND)
			);
		}

		const imageArr = [];

		if (req.files) {
			// destroy the existing images and save the images

			for (let i = 0; i < product.photos.length; i += 1) {
				// eslint-disable-next-line no-await-in-loop, security/detect-object-injection
				await cloudinary.uploader.destroy(product.photos[i].id);
			}

			// upload and save the new images
			const images: UploadApiOptions = req.files.photos;

			// check if the image is a valid image
			// const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp'];

			// for (let i = 0; i < images.length; i += 1) {
			// 	// eslint-disable-next-line no-await-in-loop
			// 	const extensionName = path.extname(images[i].name);

			// 	if (!allowedExtensions.includes(extensionName)) {
			// 		const message = 'Invalid image type.';

			// 		return next(
			// 			new APIError(
			// 				message,
			// 				'adminUpdateSingleProductHandler',
			// 				HttpStatusCode.UNPROCESSABLE_ENTITY
			// 			)
			// 		);
			// 	}
			// }

			for (let i = 0; i < images.length; i += 1) {
				// eslint-disable-next-line no-await-in-loop
				const result = await cloudinary.uploader.upload(images[i].tempFilePath, {
					folder: config.get<string>('productImageDir')
				});

				// pushing the images to imageArr
				imageArr.push({
					id: result.public_id,
					secure_url: result.secure_url
				});
			}
			req.body.photos = imageArr;
		}

		product = await updateProductById(req.params.id, req.body);

		res.status(201).json({success: true, product});
	}
);

/** 
@desc    Admin Delete Single Product
@route   DELETE /api/v1/admin/product/:id
@access  Private
*/
export const adminDeleteSingleProductHandler = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
		const {id} = req.params;

		isValidMongooseObjectId(id, next);

		const product = await findProductById(id);

		if (!product) {
			const message = 'Product not found.';

			return next(
				new APIError(message, 'adminDeleteSingleProductHandler', HttpStatusCode.NOT_FOUND)
			);
		}

		// destroy the existing images
		for (let i = 0; i < product.photos.length; i += 1) {
			// eslint-disable-next-line no-await-in-loop
			await cloudinary.uploader.destroy(product.photos[i].id);
		}

		await product.remove();

		res.status(202).json({success: true, message: 'Product deleted successfully'});
	}
);

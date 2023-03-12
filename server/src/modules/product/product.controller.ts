/* eslint-disable radix */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable security/detect-object-injection */
import {Request, Response, NextFunction} from 'express';
import {v2 as cloudinary, UploadApiOptions} from 'cloudinary';
import path from 'path';
import config from 'config';
import {BigPromise} from '../../middlewares';
import {isValidMongooseObjectId, WhereClause, APIError} from '../../utils';
import {IGetUserAuthInfoRequest} from '../user/user.types';
import {HttpStatusCode} from '../../types/http.model';
import {totalProducts, findProductById, updateProductById, addProduct} from './product.service';
import Product from './product.model';

/** 
@desc    Get Products
@route   GET /api/v1/products
@access  Public
*/
// export const getAllProductsHandler = BigPromise(async (req: Request, res: Response) => {
// 	const resultPerPage = 6;

// 	// count the total products (all products)
// 	const productCount = await totalProducts();

// 	const productsObj = new WhereClause(Product.find(), req.query).search().filter();

// 	let products = await productsObj.base;

// 	const filteredProductNumber = products.length;

// 	productsObj.pager(resultPerPage);

// 	// if we have some chained query going on, like .find(), .somethingFind() on top of that, mongoose doesn't allow all of that, all we gotta do, chain a .clone()
// 	products = await productsObj.base.clone();
// 	const pageCount = Math.ceil(productCount / resultPerPage);

// 	res.status(200).json({
// 		success: true,
// 		products,
// 		filteredProductNumber,
// 		productCount,
// 		pageCount
// 	});
// });

export const getAllProductsHandler = BigPromise(async (req: Request, res: Response) => {
	const resultPerPage = 6;

	// count the total products (all products)
	const productCount = await totalProducts();

	const page = parseInt(req.query.page as string) - 1 || 0;
	const limit = parseInt(req.query.limit as string) || 20;
	const search = req.query.search || '';
	let sort = req.query.sort || 'price';
	let category = req.query.category || 'All';
	let size = req.query.size || 'All';
	let gender = req.query.gender || 'All';

	const categoryOptions = [
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
	const genderOptions = ['Men', 'Women', 'Unisex'];
	const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL'];

	category === 'All'
		? (category = [...categoryOptions])
		: (category = (req.query.category as string).split(','));
	gender === 'All'
		? (gender = [...genderOptions])
		: (gender = (req.query.gender as string).split(','));
	size === 'All' ? (size = [...sizeOptions]) : (size = (req.query.size as string).split(','));
	req.query.sort ? (sort = (req.query.sort as string).split(',')) : (sort = [sort as string]);

	const sortBy = {};
	// @ts-ignore
	if (sort[1]) {
		// @ts-ignore
		// eslint-disable-next-line prefer-destructuring
		sortBy[sort[0]] = sort[1];
	} else {
		// @ts-ignore
		sortBy[sort[0]] = 'asc';
	}

	const products = await Product.find({
		$or: [{name: {$regex: search, $options: 'i'}}, {category: {$regex: search, $options: 'i'}}]
	})
		.where('category')
		.in([...category])
		.where('gender')
		.in([...gender])
		.where('size')
		.in([...sizeOptions])
		.sort(sortBy)
		.skip(page * limit)
		.limit(limit)
		.lean();

	const total = await Product.countDocuments({
		category: {$in: [...category]},
		name: {$regex: search, $options: 'i'}
	});
	const pageCount = Math.ceil(productCount / resultPerPage);

	res.status(200).json({
		success: true,
		productCount,
		total,
		limit,
		page: page + 1,
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
@desc    Add Review
@route   PUT /api/v1/review
@access  Private
*/
export const addReviewHandler = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
		const {rating, comment, productId} = req.body;

		const review = {
			user: req.user._id,
			name: req.user.name,
			rating: Number(rating),
			comment
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
					rev.comment = comment;
					rev.rating = rating;
				}
			});
		} else {
			product?.reviews.push(review);
			if (product) product.numberOfReviews = product.reviews.length;
		}

		// adjust ratings
		if (product) {
			product.ratings =
				product.reviews.reduce((acc, item) => item.rating + acc, 0) /
				product.reviews.length;
		}

		await product?.save({validateBeforeSave: false});

		res.status(200).json({success: true});
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
			ratings,
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

		res.status(200).json({success: true, reviews: product?.reviews});
	}
);

/** 
@desc    Admin Get All Products
@route   GET /api/v1/admin/products
@access  Private
*/
export const adminGetAllProductsHandler = BigPromise(async (req: Request, res: Response) => {
	const resultPerPage = 12;

	// count the total products (all products)
	const productCount = await totalProducts();

	const productsObj = new WhereClause(Product.find(), req.query).search().filter();

	let products = await productsObj.base;

	const filteredProductNumber = products.length;

	productsObj.pager(resultPerPage);

	// if we have some chained query going on, like .find(), .somethingFind() on top of that, mongoose doesn't allow all of that, all we gotta do, chain a .clone()
	products = await productsObj.base.clone();
	const pageCount = Math.ceil(productCount / resultPerPage);

	res.status(200).json({
		success: true,
		products,
		filteredProductNumber,
		productCount,
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
				// eslint-disable-next-line no-await-in-loop
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
				// eslint-disable-next-line no-await-in-loop
				await cloudinary.uploader.destroy(product.photos[i].id);
			}

			// upload and save the new images
			const images: UploadApiOptions = req.files.photos;

			// check if the image is a valid image
			const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp'];

			for (let i = 0; i < images.length; i += 1) {
				// eslint-disable-next-line no-await-in-loop
				const extensionName = path.extname(images[i].name);

				if (!allowedExtensions.includes(extensionName)) {
					const message = 'Invalid image type.';

					return next(
						new APIError(
							message,
							'adminUpdateSingleProductHandler',
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

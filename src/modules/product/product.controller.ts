/* eslint-disable security/detect-object-injection */
import {Request, Response, NextFunction} from 'express';
import {v2 as cloudinary, UploadApiOptions} from 'cloudinary';
import path from 'path';
import config from 'config';
import {BigPromise} from '../../middlewares';
import {CustomError, logger, isValidMongooseObjectId, WhereClause} from '../../utils';
import {IGetUserAuthInfoRequest} from '../user/user.types';
import {
	totalProducts,
	findProduct,
	findProductById,
	updateProductById,
	addProduct
} from './product.service';
import Product from './product.model';

/**
@desc    Get Products
@route   GET /api/v1/products
@access  Public
*/
export const getAllProductsHandler = BigPromise(async (req: Request, res: Response) => {
	const resultPerPage = 6;

	// count the total products (all products)
	const productCount = await totalProducts();

	const productsObj = new WhereClause(Product.find(), req.query).search().filter();

	let products = await productsObj.base;

	const filteredProductNumber = products.length;

	productsObj.pager(resultPerPage);

	// if we have some chained query going on, like .find(), .somethingFind() on top of that, mongoose doesn't allow all of that, all we gotta do, chain a .clone()
	products = await productsObj.base.clone();

	res.status(200).json({
		success: true,
		products,
		filteredProductNumber,
		productCount
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
			const logErr: CustomError = new CustomError(
				`No product found, please correct the data and try again`,
				400
			);
			logger.error(logErr);
			return next(logErr);
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
	const products = await findProduct();

	res.status(200).json({success: true, products});
});

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
			const logErr: CustomError = new CustomError('Images are required', 401);
			logger.error(logErr);
			return next(logErr);
		}

		if (req.files) {
			// upload images to cloudinary

			const images: UploadApiOptions = req.files.photos;

			// check if the image is a valid image
			const allowedExtensions = ['.png', '.jpg', '.jpeg'];

			for (let i = 0; i < images.length; i += 1) {
				// eslint-disable-next-line no-await-in-loop
				const extensionName = path.extname(images[i].name);

				if (!allowedExtensions.includes(extensionName)) {
					const logErr: CustomError = new CustomError('Invalid Image', 422);
					logger.error(logErr);
					return next(logErr);
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
			const logErr: CustomError = new CustomError(
				`No product found with the id of ${id}`,
				400
			);
			logger.error(logErr);
			return next(logErr);
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
			const allowedExtensions = ['.png', '.jpg', '.jpeg'];

			for (let i = 0; i < images.length; i += 1) {
				// eslint-disable-next-line no-await-in-loop
				const extensionName = path.extname(images[i].name);

				if (!allowedExtensions.includes(extensionName)) {
					const logErr: CustomError = new CustomError('Invalid Image', 422);
					logger.error(logErr);
					return next(logErr);
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
		console.log(req.body);

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
			const logErr: CustomError = new CustomError(
				`No product found with the id of ${id}`,
				400
			);
			logger.error(logErr);
			return next(logErr);
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

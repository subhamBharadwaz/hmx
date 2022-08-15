/* eslint-disable security/detect-object-injection */
/* eslint-disable import/prefer-default-export */
import {Request, Response, NextFunction} from 'express';
import {v2 as cloudinary, UploadApiOptions} from 'cloudinary';
import path from 'path';
import config from 'config';
import Product from '../models/product.model';
import {BigPromise} from '../middlewares/index';
import {CustomError, logger, isValidMongooseObjectId, WhereClause} from '../utils/index';
import {IGetUserAuthInfoRequest} from '../types/types.user';

let logErr: CustomError;

/** 
@desc    Get Products
@route   GET /api/v1/products
@access  Public
*/
export const getAllProducts = BigPromise(async (req: Request, res: Response) => {
	const resultPerPage = 6;

	// count the total products (all products)
	const productCount = await Product.countDocuments();

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
export const getSingleProduct = BigPromise(
	async (req: Request, res: Response, next: NextFunction) => {
		const {id} = req.params;

		isValidMongooseObjectId(id, next);

		const product = await Product.findById(id);

		if (!product) {
			logErr = new CustomError(
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
export const addReview = BigPromise(
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
		const product = await Product.findById(productId);

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
export const deleteReview = BigPromise(async (req: IGetUserAuthInfoRequest, res: Response) => {
	const {productId} = req.query;

	const product = await Product.findById(productId);

	const reviews = product?.reviews.filter(rev => rev.user.toString() !== req.user._id.toString());

	// update total number of reviews
	const numberOfReviews = reviews?.length;

	// adjust ratings
	let ratings = product?.ratings;

	if (reviews) {
		ratings = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
	}

	// update the product
	await Product.findByIdAndUpdate(
		productId,
		{
			reviews,
			ratings,
			name: req.user.name,
			numberOfReviews
		},
		{
			new: true,
			runValidators: true,
			useFindAndModify: false
		}
	);

	res.status(200).json({success: true});
});

/** 
@desc    Get reviews for one product
@route   GET /api/v1/reviews
@access  Public
*/
export const getSingleProductReviews = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response) => {
		const product = await Product.findById(req.query.id);

		res.status(200).json({success: true, reviews: product?.reviews});
	}
);

/** 
@desc    Admin Get All Products
@route   GET /api/v1/admin/products
@access  Private
*/
export const adminGetAllProducts = BigPromise(async (req: Request, res: Response) => {
	const products = await Product.find();

	res.status(200).json({success: true, products});
});

/** 
@desc    Admin Add Product
@route   POST /api/v1/product
@access  Private
*/
export const adminAddProduct = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
		// images
		const imageArr = [];

		// check whether the images are exists or not
		if (!req.files) {
			logErr = new CustomError('Images are required', 401);
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
					logErr = new CustomError('Invalid Image', 422);
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

		const product = await Product.create(req.body);

		res.status(201).json({success: true, product});
	}
);

/** 
@desc    Admin Update Single Product
@route   PUT /api/v1/admin/product/:id
@access  Private
*/
export const adminUpdateSingleProduct = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
		const {id} = req.params;

		isValidMongooseObjectId(id, next);

		let product = await Product.findById(id);

		if (!product) {
			logErr = new CustomError(`No product found with the id of ${id}`, 400);
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
					logErr = new CustomError('Invalid Image', 422);
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

		product = await Product.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
			useFindAndModify: false
		});

		res.status(201).json({success: true, product});
	}
);

/** 
@desc    Admin Delete Single Product
@route   DELETE /api/v1/admin/product/:id
@access  Private
*/
export const adminDeleteSingleProduct = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
		const {id} = req.params;

		isValidMongooseObjectId(id, next);

		const product = await Product.findById(id);

		if (!product) {
			logErr = new CustomError(`No product found with the id of ${id}`, 400);
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

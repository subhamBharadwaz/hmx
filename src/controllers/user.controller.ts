import {Request, Response, NextFunction} from 'express';
import {v2 as cloudinary, UploadApiOptions} from 'cloudinary';
import crypto from 'crypto';
import path from 'path';
import User from '@model/user.model';
import {BigPromise} from '@middleware/index';
import {CustomError, cookieToken, mailHelper, logger, isValidMongooseObjectId} from '@util/index';
import {IUser, IGetUserAuthInfoRequest} from '@type/types.user';

// log errors
let logErr: CustomError;

/** 
@desc    Register User
@route   POST /api/v1/register
@access  Public
*/
export const register = BigPromise(async (req: Request, res: Response, next: NextFunction) => {
	// check for images
	if (!req.files) {
		logErr = new CustomError('Photo is required for register', 400);
		logger.error(logErr);
		return next(logErr);
	}

	const {firstName, lastName, email, password}: IUser = req.body;

	// check for presence of email and password
	if (!(firstName && lastName && email && password)) {
		logErr = new CustomError(
			'First Name, Last Name, Email, Password and Photo are required',
			400
		);
		logger.error(logErr);
		return next(logErr);
	}

	// upload photo to cloudinary
	const file: UploadApiOptions = req.files.photo;

	// check if the image is a valid image
	const extensionName = path.extname(file.name);
	const allowedExtensions = ['.png', '.jpg', '.jpeg'];

	if (!allowedExtensions.includes(extensionName)) {
		logErr = new CustomError('Invalid Image', 422);
		logger.error(logErr);
		return next(logErr);
	}

	const result = await cloudinary.uploader.upload(file.tempFilePath, {
		folder: 'users',
		width: 150,
		crop: 'scale'
	});

	// if the user already signed up with the same email
	const existingUser = await User.findOne({email});

	if (existingUser) {
		logErr = new CustomError('User already exists!', 401);
		logger.error(logErr);
		return next(logErr);
	}

	// create user
	const user = await User.create({
		firstName,
		lastName,
		email,
		password,
		photo: {
			id: result.public_id,
			secure_url: result.secure_url
		}
	} as IUser);

	cookieToken(user, res);
});

/** 
@desc    Login User
@route   POST /api/v1/login
@access  Public
*/
export const login = BigPromise(async (req: Request, res: Response, next: NextFunction) => {
	const {email, password}: IUser = req.body;

	// check for presence of email and password
	if (!(email && password)) {
		logErr = new CustomError('Email, Password are required', 400);
		logger.error(logErr);
		return next(logErr);
	}

	const user = await User.findOne({email}).select('+password');

	if (!user) {
		logErr = new CustomError('Email or password does not match or exist', 400);
		logger.error(logErr);
		return next(logErr);
	}

	// match the password
	const isPasswordCorrect = await user.comparePassword(password);

	// if password do not match
	if (!isPasswordCorrect) {
		logErr = new CustomError('Email or password does not match or exist', 400);
		logger.error(logErr);
		return next(logErr);
	}

	cookieToken(user, res);
});

/** 
@desc    Logout User
@route   GET /api/v1/logout
@access  Private
*/
export const logout = BigPromise(async (req: Request, res: Response) => {
	// delete the cookie
	res.cookie('token', null, {
		expires: new Date(Date.now()),
		httpOnly: true
	});

	res.status(200).json({
		success: true,
		message: 'Logout Success'
	});
});

/** 
@desc    Forgot Password
@route   POST /api/v1/forgotpassword
@access  Public
*/
export const forgotPassword = BigPromise(
	async (req: Request, res: Response, next: NextFunction) => {
		const {email}: IUser = req.body;

		const user = await User.findOne({email});

		if (!user) {
			logErr = new CustomError('User does not exist', 400);
			logger.error(logErr);
			return next(logErr);
		}

		// get token from user model method
		const forgotToken = user.getForgotPasswordToken();

		// save user fields in db
		/**
		 * https://mongoosejs.com/docs/guide.html#validateBeforeSave
		 *
		 * If you want to handle validation manually, and be able to save objects which don't pass validation, you can set validateBeforeSave to false.
		 */
		await user.save({validateBeforeSave: false});

		// craft a URL
		const forgotPasswordUrl = `${req.protocol}://${req.get(
			'host'
		)}/api/v1/password/reset/${forgotToken}`;

		// craft a message
		const message = `Copy paste this link in your url and hit enter \n\n ${forgotPasswordUrl}`;

		// attempt to send email
		try {
			await mailHelper({
				email: user.email,
				subject: 'HMX - Password reset email',
				message
			});

			// json response if email is success
			res.status(200).json({success: true, message: 'Email sent successfully'});
		} catch (err) {
			// reset user fields if things goes wrong
			user.forgotPasswordToken = undefined;
			user.forgotPasswordExpiry = undefined;

			await user.save({validateBeforeSave: false});

			let errorMessage = 'Failed to send email';
			if (err instanceof Error) {
				errorMessage = err.message;
				logErr = new CustomError(errorMessage, 500);
				logger.error(logErr);
				return next(logErr);
			}
			logErr = new CustomError(errorMessage, 500);
			logger.error(logErr);
			return next(logErr);
		}
	}
);

/** 
@desc    Reset Password
@route   POST /api/v1/password/reset/:token
@access  Public
*/
export const passwordReset = BigPromise(async (req: Request, res: Response, next: NextFunction) => {
	const {token} = req.params;

	// hash the token as db also stores the hashed version
	const encryptedToken = crypto.createHash('sha256').update(token).digest('hex');

	// find user based on hashed token and time in future
	const user = await User.findOne({
		encryptedToken,
		forgotPasswordExpiry: {$gt: Date.now()} // only want to find the user whose forgotPasswordExpiry is in the future
	});

	if (!user) {
		logErr = new CustomError('Token is invalid or expired', 400);
		logger.error(logErr);
		return next(logErr);
	}

	// check if password and confirm password matched
	if (req.body.password !== req.body.confirmPassword) {
		logErr = new CustomError('Password and confirm password do not matched', 400);
		logger.error(logErr);
		return next(logErr);
	}

	// update password field in DB
	user.password = req.body.password;

	// reset token fields
	user.forgotPasswordToken = undefined;
	user.forgotPasswordExpiry = undefined;

	// save the user
	await user.save();

	// craft a message
	const message = `Hello ${user.firstName}! Your password has been reset successfully.`;

	// attempt to send email
	try {
		await mailHelper({
			email: user.email,
			subject: 'HMX - Password reset successful',
			message
		});

		// json response if email is success
		res.status(200).json({success: true, message: 'Email sent successfully'});
	} catch (err) {
		let errorMessage = 'Failed to send email';
		if (err instanceof Error) {
			errorMessage = err.message;
			logErr = new CustomError(errorMessage, 500);
			logger.error(logErr);
			return next(logErr);
		}
		logErr = new CustomError(errorMessage, 500);
		logger.error(logErr);
		return next(logErr);
	}

	cookieToken(user, res);
});

/** 
@desc    Get Logged-in User Details
@route   POST /api/v1/userdashboard
@access  Private
*/
export const getUser = BigPromise(async (req: IGetUserAuthInfoRequest, res: Response) => {
	const user = await User.findById(req.user.id).select('-password');

	res.status(200).json({success: true, user});
});

/** 
@desc    Change password
@route   PUT /api/v1/password/update
@access  Private
*/
export const changePassword = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
		const userId: string = req.user.id;

		const user = await User.findById(userId).select('+password');

		// if current password is incorrect
		const isCorrectCurrentPassword = await user?.comparePassword(req.body.currentPassword);

		if (!isCorrectCurrentPassword) {
			logErr = new CustomError('Current password is incorrect', 400);
			logger.error(logErr);
			return next(logErr);
		}

		// if new password and confirm new password are not equal
		if (req.body.newPassword !== req.body.confirmNewPassword) {
			logErr = new CustomError('New password and confirm password do not matched', 400);
			logger.error(logErr);
			return next(logErr);
		}

		// for object possibly null ts error
		if (user !== null) {
			// set new password to the password field in d
			user.password = req.body.newPassword;

			// save the new password to db
			await user.save();

			cookieToken(user, res);
		}
	}
);

/** 
@desc    Update user details
@route   PUT /api/v1/userdashboard/update
@access  Private
*/
export const updateUserDetails = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
		const {firstName, lastName, email}: IUser = req.body;

		const newData = {
			firstName,
			lastName,
			email
		} as IUser;

		if (req.files) {
			const user = await User.findById(req.user.id);

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const imageId: any = user?.photo.id;

			// delete photo on cloudinary
			await cloudinary.uploader.destroy(imageId);

			// upload new photo
			// upload photo to cloudinary
			const file: UploadApiOptions = req.files.photo;

			// check if the image is a valid image
			const extensionName = path.extname(file.name);
			const allowedExtensions = ['.png', '.jpg', '.jpeg'];

			if (!allowedExtensions.includes(extensionName)) {
				logErr = new CustomError('Invalid Image', 422);
				logger.error(logErr);
				return next(logErr);
			}

			const result = await cloudinary.uploader.upload(file.tempFilePath, {
				folder: 'users',
				width: 150,
				crop: 'scale'
			});

			// add photo data in newData object
			newData.photo = {
				id: result.public_id,
				secure_url: result.secure_url
			};
		}

		// update data in user
		const user = await User.findByIdAndUpdate(req.user.id, newData, {
			new: true,
			runValidators: true,
			useFindAndModify: false
		}).select('-password');

		res.status(201).json({success: true, user});
	}
);

/** 
@desc    Get all users - Admin only
@route   GET /api/v1/admin/users
@access  Private
*/
export const adminAllUsers = BigPromise(async (req: IGetUserAuthInfoRequest, res: Response) => {
	const users = await User.find().select('-password');

	res.status(200).json({success: true, users});
});

/** 
@desc    Get a single user - Admin only
@route   GET /api/v1/admin/user/:id
@access  Private
*/
export const adminSingleUser = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
		const {id} = req.params;

		// check for if the given id is an valid objectId or not
		isValidMongooseObjectId(id, next);
		const user = await User.findById(id).select('-password');

		if (!user) {
			logErr = new CustomError(`No user found with the id of ${id}`, 400);
			logger.error(logErr);
			return next(logErr);
		}

		res.status(200).json({success: true, user});
	}
);

/** 
@desc    Update a single user details - Admin only
@route   PUT /api/v1/admin/user/:id
@access  Private
*/
export const adminUpdateUserDetails = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
		const {id} = req.params;
		const {firstName, lastName, email, role}: IUser = req.body;
		const newData = {
			firstName,
			lastName,
			email,
			role
		} as IUser;

		// check for if the given id is an valid objectId or not
		isValidMongooseObjectId(id, next);

		const isUserExists = await User.findById(id);

		if (!isUserExists) {
			logErr = new CustomError(`No user found with the id of ${id}`, 401);
			logger.error(logErr);
			return next(logErr);
		}

		const user = await User.findByIdAndUpdate(id, newData, {
			new: true,
			runValidators: true,
			useFindAndModify: false
		}).select('-password');

		res.status(201).json({success: true, user});
	}
);

/** 
@desc    Delete a single user - Admin only
@route   DELETE /api/v1/admin/user/:id
@access  Private
*/
export const adminDeleteUser = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
		const {id} = req.params;

		// check for if the given id is an valid objectId or not
		isValidMongooseObjectId(id, next);

		const user = await User.findById(id);

		if (!user) {
			logErr = new CustomError(`No user found with the id of ${id}`, 401);
			logger.error(logErr);
			return next(logErr);
		}

		// get the image id
		const imageId = user.photo.id;
		// delete user's image from cloudinary
		await cloudinary.uploader.destroy(imageId);

		await user.remove();

		res.status(200).json({
			success: true,
			message: `Successfully deleted the user with id ${id}`
		});
	}
);

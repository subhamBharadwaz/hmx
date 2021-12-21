import {Request, Response, NextFunction} from 'express';
import {v2 as cloudinary, UploadApiOptions} from 'cloudinary';
import crypto from 'crypto';
import User from '../models/user.model';
import CustomError from '../utils/customError';
import BigPromise from '../middlewares/bigPromise';
import cookieToken from '../utils/cookieToken';
import mailHelper from '../utils/mailHelper';
import {IUser, IGetUserAuthInfoRequest} from '../types/types.user';

/** 
@desc    Register User
@route   POST /api/v1/register
@access  Public
*/
export const register = BigPromise(async (req: Request, res: Response, next: NextFunction) => {
	// check for images
	if (!req.files) {
		return next(new CustomError('Photo is required for register', 400));
	}

	const {firstName, lastName, email, password}: IUser = req.body;

	// check for presence of email and password
	if (!(firstName && lastName && email && password)) {
		return next(
			new CustomError('First Name, Last Name, Email, Password and Photo are required', 400)
		);
	}

	// upload photo to cloudinary
	const file: UploadApiOptions = req.files.photo;

	const result = await cloudinary.uploader.upload(file.tempFilePath, {
		folder: 'users',
		width: 150,
		crop: 'scale'
	});

	// if the user already signed up with the same email
	const existingUser = await User.findOne({email});

	if (existingUser) return next(new CustomError('User already signed up!', 401));

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
		return next(new CustomError('Email, Password are required', 400));
	}

	const user = await User.findOne({email}).select('+password');

	if (!user) {
		return next(new CustomError('Email or password does not match or exist', 400));
	}

	// match the password
	const isPasswordCorrect = await user.comparePassword(password);

	// if password do not match
	if (!isPasswordCorrect) {
		return next(new CustomError('Email or password does not match or exist', 400));
	}

	cookieToken(user, res);
});

/** 
@desc    Logout User
@route   GET /api/v1/logout
@access  Private
*/
export const logout = BigPromise(async (req: Request, res: Response, next: NextFunction) => {
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
			return next(new CustomError('User does not exist', 400));
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
				return next(new CustomError(errorMessage, 500));
			}
			return next(new CustomError(errorMessage, 500));
		}
	}
);

/** 
@desc    Reset Password
@route   POST /api/v1/password/reset/:token
@access  Public
*/
export const passwordReset = BigPromise(async (req: Request, res: Response, next: NextFunction) => {
	const token = req.params.token;

	// hash the token as db also stores the hashed version
	const encryptedToken = crypto.createHash('sha256').update(token).digest('hex');

	// find user based on hashed token and time in future
	const user = await User.findOne({
		encryptedToken,
		forgotPasswordExpiry: {$gt: Date.now()} // only want to find the user whose forgotPasswordExpiry is in the future
	});

	if (!user) {
		return next(new CustomError('Token is invalid or expired', 400));
	}

	// check if password and confirm password matched
	if (req.body.password !== req.body.confirmPassword) {
		return next(new CustomError('Password and confirm password do not matched', 400));
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
			return next(new CustomError(errorMessage, 500));
		}
		return next(new CustomError(errorMessage, 500));
	}

	cookieToken(user, res);
});

/** 
@desc    Get Logged-in User Details
@route   POST /api/v1/user
@access  Private
*/
export const getUser = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
		const user = await User.findById(req.user.id).select('-password');

		res.status(200).json({success: true, user});
	}
);

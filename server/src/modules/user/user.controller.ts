import {Request, Response, NextFunction} from 'express';
import {v2 as cloudinary, UploadApiOptions} from 'cloudinary';
import crypto from 'crypto';
import path from 'path';
import config from 'config';
import {BigPromise} from '../../middlewares';
import {CustomError, cookieToken, mailHelper, logger, isValidMongooseObjectId} from '../../utils';
import {IUser, IGetUserAuthInfoRequest} from './user.types';
import {CreateLoginUserInput} from './user.schema';
import {
	findUser,
	findAllUsers,
	findUserById,
	registerUser,
	resetPassword,
	updateUser
} from './user.service';

/** 
@desc    Register User
@route   POST /api/v1/register
@access  Public
*/
export const registerHandler = BigPromise(
	async (req: Request, res: Response, next: NextFunction) => {
		const {firstName, lastName, email, password, phoneNumber}: IUser = req.body;

		// check for presence of the required fields
		if (!(firstName && lastName && email && password)) {
			const logErr: CustomError = new CustomError(
				'First Name, Last Name, Email, Password and Photo are required',
				400
			);
			logger.error(logErr);
			return next(logErr);
		}

		// if the user already signed up with the same email
		const existingUser = await findUser(email);

		if (existingUser) {
			const logErr: CustomError = new CustomError('User already exists!', 401);
			logger.error(logErr);
			return next(logErr);
		}

		// upload photo to cloudinary
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const file: UploadApiOptions = req.files!.photo;

		// check if the image is a valid image
		const extensionName = path.extname(file.name);
		const allowedExtensions = ['.png', '.jpg', '.jpeg'];

		if (!allowedExtensions.includes(extensionName)) {
			const logErr: CustomError = new CustomError('Invalid Image', 422);
			logger.error(logErr);
			return next(logErr);
		}

		const result = await cloudinary.uploader.upload(file.tempFilePath, {
			folder: config.get<string>('userImageDir'),
			width: 150,
			crop: 'scale'
		});

		// create user
		const user = await registerUser({
			firstName,
			lastName,
			email,
			password,
			phoneNumber,
			photo: {
				id: result.public_id,
				secure_url: result.secure_url
			}
		});

		cookieToken(user, res);
	}
);

/** 
@desc    Login User
@route   POST /api/v1/login
@access  Public
*/
export const loginHandler = BigPromise(
	async (req: Request<{}, {}, CreateLoginUserInput>, res: Response, next: NextFunction) => {
		const {email, password} = req.body;

		// check for presence of email and password
		if (!(email && password)) {
			const logErr: CustomError = new CustomError('Email, Password are required', 400);
			logger.error(logErr);
			return next(logErr);
		}

		const user = await findUser(email, '+password');

		if (!user) {
			const logErr: CustomError = new CustomError(
				'Email or password does not match or exist',
				400
			);
			logger.error(logErr);
			return next(logErr);
		}

		// match the password
		const isPasswordCorrect = await user.comparePassword(password);

		// if password do not match
		if (!isPasswordCorrect) {
			const logErr: CustomError = new CustomError(
				'Email or password does not match or exist',
				400
			);
			logger.error(logErr);
			return next(logErr);
		}

		cookieToken(user, res);
	}
);

/** 
@desc    Logout User
@route   GET /api/v1/logout
@access  Private
*/
export const logoutHandler = BigPromise(async (req: Request, res: Response) => {
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
export const forgotPasswordHandler = BigPromise(
	async (req: Request, res: Response, next: NextFunction) => {
		const {email}: IUser = req.body;

		const user = await findUser(email);

		if (!user) {
			const logErr: CustomError = new CustomError('User does not exist', 400);
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
				const logErr: CustomError = new CustomError(errorMessage, 500);
				logger.error(logErr);
				return next(logErr);
			}
			const logErr: CustomError = new CustomError(errorMessage, 500);
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
export const passwordResetHandler = BigPromise(
	async (req: Request, res: Response, next: NextFunction) => {
		const {token} = req.params;

		// hash the token as db also stores the hashed version
		const encryptedToken = crypto.createHash('sha256').update(token).digest('hex');

		// find user based on hashed token and time in future
		const user = await resetPassword(encryptedToken);

		if (!user) {
			const logErr: CustomError = new CustomError('Token is invalid or expired', 400);
			logger.error(logErr);
			return next(logErr);
		}

		// check if password and confirm password matched
		if (req.body.password !== req.body.confirmPassword) {
			const logErr: CustomError = new CustomError(
				'Password and confirm password do not matched',
				400
			);
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
				const logErr: CustomError = new CustomError(errorMessage, 500);
				logger.error(logErr);
				return next(logErr);
			}
			const logErr: CustomError = new CustomError(errorMessage, 500);
			logger.error(logErr);
			return next(logErr);
		}

		cookieToken(user, res);
	}
);

/** 
@desc    Get Logged-in User Details
@route   POST /api/v1/userdashboard
@access  Private
*/
export const getUserHandler = BigPromise(async (req: IGetUserAuthInfoRequest, res: Response) => {
	const user = await findUserById(req.user.id, '-password');

	res.status(200).json({success: true, user});
});

/** 
@desc    Change password
@route   PUT /api/v1/password/update
@access  Private
*/
export const changePasswordHandler = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
		const user = await findUserById(req.user.id, '+password');

		// if current password is incorrect
		const isCorrectCurrentPassword = await user?.comparePassword(req.body.currentPassword);

		if (!isCorrectCurrentPassword) {
			const logErr: CustomError = new CustomError('Current password is incorrect', 400);
			logger.error(logErr);
			return next(logErr);
		}

		// if new password and confirm new password are not equal
		if (req.body.newPassword !== req.body.confirmNewPassword) {
			const logErr: CustomError = new CustomError(
				'New password and confirm password do not matched',
				400
			);
			logger.error(logErr);
			return next(logErr);
		}

		// for object possibly null ts error
		if (user !== null) {
			// set new password to the password field in db
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
export const updateUserDetailsHandler = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
		const {firstName, lastName, email}: IUser = req.body;

		const newData = {
			firstName,
			lastName,
			email
		} as IUser;

		if (req.files) {
			const user = await findUserById(req.user.id);

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
				const logErr: CustomError = new CustomError('Invalid Image', 422);
				logger.error(logErr);
				return next(logErr);
			}

			const result = await cloudinary.uploader.upload(file.tempFilePath, {
				folder: config.get<string>('userImageDir'),
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
		const user = await updateUser(req.user.id, newData, '-password');

		res.status(201).json({success: true, user});
	}
);

/** 
@desc    Get all users - Admin only
@route   GET /api/v1/admin/users
@access  Private
*/
export const adminAllUsersHandler = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response) => {
		const users = await findAllUsers('-password');

		res.status(200).json({success: true, users});
	}
);

/** 
@desc    Get a single user - Admin only
@route   GET /api/v1/admin/user/:id
@access  Private
*/
export const adminSingleUserHandler = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
		const {id} = req.params;

		// check for if the given id is an valid objectId or not
		isValidMongooseObjectId(id, next);
		const user = await findUserById(id, '-password');

		if (!user) {
			const logErr: CustomError = new CustomError(`No user found with the id of ${id}`, 400);
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
export const adminUpdateUserDetailsHandler = BigPromise(
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

		const isUserExists = await findUserById(id);

		if (!isUserExists) {
			const logErr: CustomError = new CustomError(`No user found with the id of ${id}`, 401);
			logger.error(logErr);
			return next(logErr);
		}

		const user = await updateUser(id, newData, '-password');

		res.status(201).json({success: true, user});
	}
);

/** 
@desc    Delete a single user - Admin only
@route   DELETE /api/v1/admin/user/:id
@access  Private
*/
export const adminDeleteUserHandler = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
		const {id} = req.params;

		// check for if the given id is an valid objectId or not
		isValidMongooseObjectId(id, next);

		const user = await findUserById(id);

		if (!user) {
			const logErr: CustomError = new CustomError(`No user found with the id of ${id}`, 401);
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

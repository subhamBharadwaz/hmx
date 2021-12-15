import {Request, Response, NextFunction} from 'express';
import {v2 as cloudinary, UploadApiOptions} from 'cloudinary';
import User from '../models/user.model';
import CustomError from '../utils/customError';
import BigPromise from '../middlewares/bigPromise';
import cookieToken from '../utils/cookieToken';
import {IUser} from '../types/types.user';

/** 
@desc    Signup User
@route   POST /api/v1/signup
@access  Public
*/

export const signup = BigPromise(async (req: Request, res: Response, next: NextFunction) => {
	// check for images
	if (!req.files) {
		return next(new CustomError('Photo is required for signup', 400));
	}

	const {firstName, lastName, email, password}: IUser = req.body;

	if (!(firstName && lastName && email && password)) {
		return next(
			new CustomError('First Name, Last Name, Email, Password and Photo are required', 400)
		);
	}

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

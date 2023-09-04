import {IUser} from './user.types';
// import {BigPromise} from '../../middlewares';
import User from './user.model';
import {BaseError} from '../../utils';

export async function totalUsers() {
	try {
		return User.countDocuments();
	} catch (error: any) {
		throw new BaseError('Could not perform count totalUser operation', error, 'totalUser');
	}
}

export async function registerUser(input: IUser) {
	try {
		return User.create(input);
	} catch (error: any) {
		throw new BaseError('Could not perform  register user operation', error, 'registerUser');
	}
}

export async function findUser(email: string) {
	try {
		return User.findOne({email}).select('+password');
	} catch (error: any) {
		throw new BaseError('Could not perform  find user operation', error, 'findUser');
	}
}

export async function resetPassword(token: string) {
	try {
		return User.findOne({token, forgotPasswordExpiry: {$gt: Date.now()}}); // only want to find the user whose forgotPasswordExpiry is in the future
	} catch (error: any) {
		throw new BaseError('Could not perform  reset password operation', error, 'resetPassword');
	}
}

export async function findUserById(id: string, select?: string) {
	try {
		return User.findById(id).select(select);
	} catch (error: any) {
		throw new BaseError('Could not perform  find user by ID operation', error, 'findUserById');
	}
}

export async function updateUser(id: string, data: IUser, select?: string) {
	try {
		return User.findByIdAndUpdate(id, data, {
			new: true,
			runValidators: true,
			useFindAndModify: false
		}).select(select);
	} catch (error: any) {
		throw new BaseError('Could not perform count update user operation', error, 'updateUser');
	}
}

// Admin services
export async function findAllUsers(select?: string) {
	try {
		return User.find().select(select);
	} catch (error: any) {
		throw new BaseError(
			'Could not perform count find all users operation',
			error,
			'findAllUsers'
		);
	}
}

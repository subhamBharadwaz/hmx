import {IUserDocument} from '../types/types.user';
import {Response} from 'express';

const cookieToken = (user: IUserDocument, res: Response) => {
	const token = user.getJwtToken();

	const options = {
		expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
		httpOnly: true
	};

	res.status(200).cookie('token', token, options).json({
		success: true,
		token
	});
};

export default cookieToken;

import {Response} from 'express';
import {IUserDocument} from '../modules/user/user.types';

const cookieToken = (user: IUserDocument, res: Response) => {
	const token = user.getJwtToken();

	const options = {
		expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
		httpOnly: true,
		secure: true,
		sameSite: 'none'
	};
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	res.status(200).cookie('token', token, options).json({
		success: true,
		token
	});
};

export default cookieToken;

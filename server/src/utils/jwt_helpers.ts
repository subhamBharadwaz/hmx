/* eslint-disable @typescript-eslint/ban-ts-comment */

import jwt from 'jsonwebtoken';
import config from 'config';

interface AccessTokenPayload {
	id: string;
}

interface RefreshTokenPayload {
	id: string;
}
const accessTokenSecret = config.get<string>('accessTokenSecret');
const refreshTokenSecret = config.get<string>('refreshTokenSecret');

export const signAccessToken = (payload: AccessTokenPayload) => {
	return jwt.sign(payload, accessTokenSecret, {expiresIn: '15m'});
};

export const signRefreshToken = (payload: RefreshTokenPayload) => {
	return jwt.sign(payload, refreshTokenSecret, {expiresIn: '7d'});
};

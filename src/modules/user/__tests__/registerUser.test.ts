/* eslint-disable */
import mongoose from 'mongoose';
import supertest from 'supertest';
// import * as UserService from '../user.service';
import app from '../../../app';
import {cookieToken} from '../../../utils';
import * as UserService from '../user.controller';

const registerUserInput = {
	firstName: 'Subham',
	lastName: 'Bharadwaz',
	password: 'Subham123@',
	email: 'sdeads@gmail.com'
};

describe('User', () => {
	describe('User Service', () => {
		describe('Register new user ', () => {
			it('Should return the a valid JWT token', async () => {
				const registerUserServiceMock = jest.spyOn(UserService, 'registerHandler');

				//@ts-ignore
				const {body, statusCode} = await supertest(app)
					.post('/api/v1/register')
					.send(registerUserInput);
				expect(body).toMatchObject({success: true});
				expect(registerUserServiceMock).toHaveBeenCalledWith(registerUserInput);
			});
		});
	});
});

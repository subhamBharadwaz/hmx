/* eslint-disable */
import mongoose from 'mongoose';
import supertest from 'supertest';
import * as UserService from '../user.service';
import app from '../../../app';
import {IUserDocument} from '../user.types';

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
				const registerUserServiceMock = jest.spyOn(UserService, 'registerUser');

				//@ts-ignore
				const {body} = await supertest(app)
					.post('/api/v1/register')
					.send(registerUserInput);
				//@ts-ignore
				// const jwt = user.getJwtToken()
				// expect(statusCode).toBe(200);
				expect(body).toEqual({success: true, token: expect.any(String)});
				expect(registerUserServiceMock).toHaveBeenCalledWith(registerUserInput);
			});
		});
	});
});

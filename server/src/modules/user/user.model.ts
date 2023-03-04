/* eslint-disable func-names */
import {Schema, model} from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from 'config';
import {IUserDocument, ROLE} from './user.types';

const UserSchema = new Schema<IUserDocument>(
	{
		firstName: {
			type: String,
			required: [true, 'Please provide your First Name']
		},
		lastName: {
			type: String,
			required: [true, 'Please provide your Last Name']
		},
		email: {
			type: String,
			required: [true, 'Please provide an email'],
			unique: true,
			trim: true
		},
		password: {
			type: String,
			required: [true, 'Please provide a password']
		},
		photo: {
			id: {
				type: String
			},
			secure_url: {
				type: String
			}
		},
		phoneNumber: {
			type: String,
			required: [true, 'Please provide a phone number']
		},

		role: {
			type: String,
			default: ROLE.USER
		},
		forgotPasswordToken: String,
		forgotPasswordExpiry: Date
	},
	{
		timestamps: true
	}
);

// encrypt password before save - HOOK
UserSchema.pre<IUserDocument>('save', async function (next) {
	/** only runs when the user will be created and when the user wants to change the password
	 * https://mongoosejs.com/docs/api.html#document_Document-isModified
	 *
	 * https://stackoverflow.com/questions/50581825/ismodified-and-pre-save-mongoose-nodejs
	 */
	if (!this.isModified('password')) return next();
	this.password = await bcrypt.hash(this.password, 10);
});

// compare the password with passed on user password
UserSchema.methods.comparePassword = async function (userPassword: string): Promise<boolean> {
	const comparedPassword = await bcrypt.compare(userPassword, this.password);
	return comparedPassword;
};

// create and return jwt token
UserSchema.methods.getJwtToken = function (): string {
	const jwtSecret = config.get<string>('jwtSecret');
	const jwtExpiry = config.get<string>('jwtExpiry');

	// eslint-disable-next-line no-underscore-dangle
	return jwt.sign({id: this._id}, jwtSecret, {
		expiresIn: jwtExpiry
	});
};

// generate forgot password token
UserSchema.methods.getForgotPasswordToken = function (): string {
	// generate a long and random string
	const forgotToken = crypto.randomBytes(20).toString('hex');

	// getting a hash - make sure to get a hash on the backend
	this.forgotPasswordToken = crypto.createHash('sha256').update(forgotToken).digest('hex');

	// time of token
	this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;

	/**
	 * return the forgotPass string, but in database, the encrypted value i.e forgotPasswordToken will be saved. When user sends back the forgotToken string back then it will be again encrypted and compared with the earlier encrypted value saved in db.
	 * If the both value matches that means the value was not tempered, the value
	 * was not being manipulated and you're getting exactly same.
	 */
	return forgotToken;
};

const UserModel = model<IUserDocument>('User', UserSchema);

export default UserModel;

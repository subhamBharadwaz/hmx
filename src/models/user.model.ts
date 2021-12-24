import {Schema, model} from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from 'config';
import {IUserDocument} from '../types/types.user';

const UserSchema = new Schema<IUserDocument>(
	{
		firstName: {
			type: String,
			required: true
		},
		lastName: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true,
			unique: true
		},
		password: {
			type: String,
			required: true
		},
		photo: {
			id: {
				type: String,
				required: true
			},
			secure_url: {
				type: String,
				required: true
			}
		},
		role: {
			type: String,
			default: 'user'
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
	/**only runs when the user will be created and when the user wants to change the password
	 * https://mongoosejs.com/docs/api.html#document_Document-isModified
	 *
	 * https://stackoverflow.com/questions/50581825/ismodified-and-pre-save-mongoose-nodejs
	 */
	if (!this.isModified('password')) return next();
	this.password = await bcrypt.hash(this.password, 10);
});

// compare the password with passed on user password
UserSchema.methods.comparePassword = async function (userPassword: string): Promise<boolean> {
	return await bcrypt.compare(userPassword, this.password);
};

// create and return jwt token
UserSchema.methods.getJwtToken = function (): string {
	const jwt_secret = config.get<string>('jwtSecret');
	const jwt_expiry = config.get<string>('jwtExpiry');

	return jwt.sign({id: this._id}, jwt_secret, {
		expiresIn: jwt_expiry
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

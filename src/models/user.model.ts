import {Schema, model, Document} from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface IUser extends Document {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	photo: {
		id: string;
		secureUrl: string;
	};
	role: string;
	forgotPasswordToken: string;
	forgotPasswordExpiry: Date;
	createdAt: Date;
	updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
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
			validate: [validator.isEmail, 'Please enter email in correct format'],
			unique: true
		},
		password: {
			type: String,
			required: [true, 'Please provide a password'],
			validate: [
				validator.isStrongPassword,
				'Password must be minimum 8 characters long and contains at least 1 uppercase, 1 lowercase, 1 number and 1 symbol'
			],
			select: false
		},
		photo: {
			id: {
				type: String,
				required: true
			},
			secureUrl: {
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

// encrypt password before save
UserSchema.pre<IUser>('save', async function (next) {
	/**only runs when the user will be created and when the user wants to change the password
	 * https://mongoosejs.com/docs/api.html#document_Document-isModified
	 *
	 * https://stackoverflow.com/questions/50581825/ismodified-and-pre-save-mongoose-nodejs
	 */
	if (!this.isModified('password')) return next();
	this.password = await bcrypt.hash(this.password, 10);
});

const UserModel = model<IUser>('User', UserSchema);

export default UserModel;

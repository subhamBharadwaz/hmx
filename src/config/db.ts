import mongoose from 'mongoose';

export const connectToDB = () => {
	const DB_URI = `${process.env.DB_URI}`;
	mongoose
		.connect(DB_URI)
		.then(result => console.log(`DB GOT CONNECTED`))
		.catch(err => {
			console.error(`DB Connection Issue , ${err}`);
			process.exit(1);
		});
};

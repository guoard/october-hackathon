import mongoose, { Mongoose } from 'mongoose';

const mongoURL = process.env.DATABASE_URI as string;

const dbConnection = async (): Promise<Mongoose> => {
  console.log('Connecting to database...');

  const db = await mongoose.connect(mongoURL);

  console.log(
    `Connected to database successfully. [host=${db.connection.host}] [db=${db.connection.name}]`,
  );

  return db;
};

export default dbConnection;

// mongo.js

import {MongoClient} from 'mongodb';

import {config} from 'dotenv';

config();

const client = new MongoClient(process.env.MONGODB_URI);

async function connectToMongo() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

export {connectToMongo};

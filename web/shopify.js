// shopify.js

import {BillingInterval, LATEST_API_VERSION} from '@shopify/shopify-api';
import {shopifyApp} from '@shopify/shopify-app-express';
import {MongoDBSessionStorage} from '@shopify/shopify-app-session-storage-mongodb'; // Import MongoDB session storage
import {restResources} from '@shopify/shopify-api/rest/admin/2023-04';
import {connectToMongo} from './mongo.js'; // Import MongoDB connection
import {billingConfig} from './billing.js';

// Connect to MongoDB before setting up the Shopify app
connectToMongo();

const storage = new MongoDBSessionStorage(process.env.MONGODB_URI);
const shopify = shopifyApp({
  api: {
    apiVersion: LATEST_API_VERSION,
    restResources,
    billing: billingConfig, // or replace with billingConfig above to enable example billing
  },
  auth: {
    path: '/api/auth',
    callbackPath: '/api/auth/callback',
  },
  webhooks: {
    path: '/api/webhooks',
  },
  // Use MongoDB session storage
  sessionStorage: storage,
});

export default shopify;

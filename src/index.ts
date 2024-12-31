import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import jwt from 'jsonwebtoken';
import { userResolvers } from './graphql/resolvers/userResolvers';
import { userTypeDefs } from './graphql/schemas/userTypeDefs';
import { movieReviewResolvers } from './graphql/resolvers/movieReviewResolver';
import { movieReviewTypeDefs } from './graphql/schemas/movieReviewTypeDefs';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok' });
});

// Apollo Server setup
async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs: mergeTypeDefs([userTypeDefs, movieReviewTypeDefs]),
    resolvers: mergeResolvers([userResolvers, movieReviewResolvers]),
    context: ({ req }) => {
      const auth = req.headers.authorization || '';

      if (!auth) {
        return { user: null };
      }

      try {
        const token = auth.split(' ')[1];
        const user = jwt.verify(token, process.env.JWT_SECRET);
        return { user };
      } catch (error) {
        console.error('Token verification failed:', error.message);
        return { user: null };
      }
    },
    introspection: true, // Enable introspection in production
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  // MongoDB connection
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI must be defined');
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }

  if (process.env.NODE_ENV !== 'production') {
    // Only listen on a port in development
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
      console.log(`GraphQL endpoint: http://localhost:${port}/graphql`);
    });
  }

  return app;
}

// Handle any top-level errors
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

export default startApolloServer();

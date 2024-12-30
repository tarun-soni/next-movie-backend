import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { expressjwt } from 'express-jwt';
import mongoose from 'mongoose';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import jwt from 'jsonwebtoken';
import { userResolvers } from './graphql/resolvers/userResolvers';
import { userTypeDefs } from './graphql/schemas/userTypeDefs';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// JWT middleware
// app.use(
//   expressjwt({
//     secret: process.env.JWT_SECRET || 'your-secret-key',
//     algorithms: ['HS256'],
//     credentialsRequired: false,
//   })
// );

// Apollo Server setup
async function startApolloServer() {
  // const server = new ApolloServer({
  //   typeDefs,
  //   resolvers,
  //   context: ({ req }) => {
  //     const user = req.auth || null;
  //     return { user };
  //   },
  // });

  const server = new ApolloServer({
    typeDefs: mergeTypeDefs([userTypeDefs]),
    resolvers: mergeResolvers([userResolvers]),
    context: ({ req }) => {
      const auth = req.headers.authorization || '';

      if (!auth) {
        return { user: null };
      }

      try {
        const token = auth.split(' ')[1];
        const user = jwt.verify(token, process.env.JWT_SECRET);

        // console.log('User authenticated:', user);

        if (!req.body?.query?.includes('IntrospectionQuery')) {
          console.log('Request authenticated for user:', user);
        }
        return { user: user };
      } catch (error) {
        console.error('Token verification failed:', error.message);
        return { user: null };
      }
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  // MongoDB connection
  const MONGODB_URI = process.env.MONGODB_URI || '';
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
  }

  // Start server
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log(
      `GraphQL endpoint: http://localhost:${port}${server.graphqlPath}`
    );
  });
}

startApolloServer().catch((error) => {
  console.error('❌ Server startup error:', error);
});

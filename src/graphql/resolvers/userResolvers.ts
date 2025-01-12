import { User } from '../../models/user';
import bcrypt from 'bcryptjs';
import generateToken from '../../utils/generateToken';
import { AuthenticationError } from 'apollo-server-errors';
import { Context } from '../../types/graphql';
import { Response } from 'express';
import {
  Resolvers,
  MutationCreateUserArgs,
  MutationLoginArgs,
} from '../../types/generated';

export const userResolvers: Resolvers = {
  Query: {
    // NOTES - using this query in graphql studio to quickly get the current user,
    // NOTES - this is not used in the frontend
    // NOTES - params - are - parent, args, context
    getCurrentUser: async (_, __, context: Context) => {
      if (!context || !context.user) {
        throw new AuthenticationError(`NO token`);
      }
      const {
        user: { _id },
      } = context.user;

      const user = await User.findById(_id).select('-password');
      if (!user) {
        throw new AuthenticationError('User not found');
      }

      const userToReturn = {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        token: generateToken(user),
      };

      return userToReturn;
    },
  },

  Mutation: {
    createUser: async (_, args: MutationCreateUserArgs, context: Context) => {
      const { name, email, password } = args;
      let userCheck = await User.findOne({ email });

      if (userCheck) {
        throw new AuthenticationError('USER ALREADY EXISTS');
      }
      const hashedPass = await bcrypt.hash(password, 12);

      let user = new User({
        name,
        email,
        password: hashedPass,
      });

      const token = generateToken(user);
      await user.save();

      // Set cookie for new user
      const expressRes = context.res as unknown as Response;
      expressRes.header('Authorization', `Bearer ${token}`);
      expressRes.header('Access-Control-Expose-Headers', 'Authorization');

      return {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        token,
      };
    },

    login: async (_, args: MutationLoginArgs, context: Context) => {
      const { email, password } = args;
      try {
        const user = await User.findOne({ email });
        const userWOpass = await User.findOne({ email }).select('-password');

        if (!user || !userWOpass) {
          throw new AuthenticationError('User not found');
        }

        if (await bcrypt.compare(password, user.password)) {
          const token = generateToken(userWOpass);

          // Set the token in the response headers
          const expressRes = context.res as unknown as Response;
          expressRes.header('Authorization', `Bearer ${token}`);
          expressRes.header('Access-Control-Expose-Headers', 'Authorization');

          return {
            _id: userWOpass._id.toString(),
            name: userWOpass.name,
            email: userWOpass.email,
            token,
          };
        } else {
          throw new AuthenticationError(`INVALID CREDS`);
        }
      } catch (error) {
        throw new AuthenticationError(
          `ERROR IN LOGIN, MESSAGE:${error.message}`
        );
      }
    },
  },
};

import { User } from '../../models/user';
import bcrypt from 'bcryptjs';
import generateToken from '../../utils/generateToken';
import { AuthenticationError } from 'apollo-server-errors';
import { Context } from '../../types/graphql';
import {
  Resolvers,
  MutationCreateUserArgs,
  MutationLoginArgs,
} from '../../types/generated';

export const userResolvers: Resolvers = {
  Query: {
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
    createUser: async (_, args: MutationCreateUserArgs) => {
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

      return {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        token,
      };
    },

    login: async (_, args: MutationLoginArgs) => {
      const { email, password } = args;
      try {
        const user = await User.findOne({ email });
        const userWOpass = await User.findOne({ email }).select('-password');

        if (!user || !userWOpass) {
          throw new AuthenticationError('User not found');
        }

        if (await bcrypt.compare(password, user.password)) {
          const token = generateToken(userWOpass);

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

import bcrypt from 'bcryptjs';
import generateToken from '../../utils/generateToken';
import { AuthenticationError } from 'apollo-server-errors';

export const userResolvers = {
  Query: {
    // get current data
    // auth only
    getCurrentUser: async (_, __, context) => {
      if (!context || !context.user) {
        throw new AuthenticationError(`NO token`);
      }
      const {
        user: { _id },
      } = context.user;

      const user = await User.findById(_id).select('-password');
      return user;
    },
  },

  // All mutation definations
  Mutation: {
    // parent, args, context
    createUser: async (_, { name, email, password }) => {
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
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: token,
      };
    },

    // login mutation
    login: async (_, { email, password }, context) => {
      try {
        const user = await User.findOne({ email });

        const userWOpass = await User.findOne({ email }).select('-password');
        if (user && (await bcrypt.compare(password, user.password))) {
          const token = generateToken(userWOpass);

          const userToReturn = {
            _id: userWOpass._id,
            name: userWOpass.name,
            email: userWOpass.email,

            token: token,
          };
          return userToReturn;
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

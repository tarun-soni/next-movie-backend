import bcrypt from 'bcryptjs';
import generateToken from '../../utils/generateToken';
import { AuthenticationError } from 'apollo-server-errors';
import { MovieReview } from '../../models/movieReview';

export const movieReviewResolvers = {
  Query: {
    // get current data
    // auth only
    getAllMovieReviews: async (_, __, context) => {
      if (!context || !context.user) {
        throw new AuthenticationError(`NO token`);
      }
      const {
        user: { _id },
      } = context.user;

      const movieReviews = await MovieReview.find({ userId: _id });

      return movieReviews;
    },

    getMovieReviewByMovieId: async (_, { movieId }, context) => {
      if (!context || !context.user) {
        throw new AuthenticationError(`NO token`);
      }
      const {
        user: { _id },
      } = context.user;
      const movieReview = await MovieReview.findOne({ movieId, userId: _id });
      return movieReview;
    },
  },

  // All mutation definations
  Mutation: {
    // parent, args, context
    createMovieReview: async (_, { movieId, rating, reviewText, userId }) => {
      let userCheck = await MovieReview.findOne({ movieId });

      console.log({ movieId, rating, reviewText, userId });

      try {
        let movieReview = new MovieReview({
          movieId,
          rating,
          reviewText,
          userId,
        });
        await movieReview.save();
        return movieReview;
      } catch (error) {
        throw new Error(`Error creating movie review: ${error.message}`);
      }
    },

    // login mutation
    deleteMovieReview: async (_, { movieId }, context) => {
      try {
        const movieReview = await MovieReview.findOne({ movieId });

        if (movieReview) {
          await MovieReview.deleteOne({ movieId });
          return { message: 'Movie review deleted successfully' };
        } else {
          throw new Error('Movie review not found');
        }
      } catch (error) {
        throw new Error(`Error deleting movie review: ${error.message}`);
      }
    },
  },
};

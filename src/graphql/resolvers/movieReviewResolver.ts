import bcrypt from 'bcryptjs';
import generateToken from '../../utils/generateToken';
import { AuthenticationError } from 'apollo-server-errors';
import { MovieReview } from '../../models/movieReview';
import { User } from '../../models/user';
import { getApiUrl } from '../../config/apiURL';

export const movieReviewResolvers = {
  MovieReview: {
    user: async (parent) => {
      const user = await User.findById(parent.userId).select('-password');
      return user;
    },
  },

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

    getMovieReviewByMovieId: async (_, { movieId }) => {
      // Get all reviews for this movie
      const movieReviews = await MovieReview.find({ movieId });

      if (!movieReviews || movieReviews.length === 0) {
        console.log('no movie reviews found');
        return [];
      }

      return movieReviews;
    },

    getGraphqlPopularMovies: async (_, { pageNumber }) => {
      console.log('inside getGraphqlPopularMovies');
      try {
        // Get all reviews for this movie
        // const { searchParams } = new URL(request.url);
        // const query = searchParams.get('query');
        // const page = searchParams.get('page') || '1';

        console.log('pageNumber', pageNumber);

        const page = pageNumber || 1;

        const apiUrl = getApiUrl(page);

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch from TMDB');
        }

        const data = await response.json();

        // return NextResponse.json(data.results);
        return {
          // results: data.results.map((r) => {
          //   return {
          //     id: r.id,
          //   };
          // }),
          results: data.results,
          total_pages: data.total_pages,
          total_results: data.total_results,
        };
      } catch (error) {
        console.log('error', error);
      }
    },
  },

  // All mutation definations
  Mutation: {
    // parent, args, context
    // TODO: add the context here for userID
    createMovieReview: async (_, { movieId, rating, reviewText, userId }) => {
      // Check if this user has already reviewed this movie
      const existingReview = await MovieReview.findOne({ movieId, userId });

      if (existingReview) {
        throw new Error('You have already reviewed this movie');
      }

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
    // TODO: check for user id

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

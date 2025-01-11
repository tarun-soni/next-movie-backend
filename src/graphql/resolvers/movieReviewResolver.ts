import { AuthenticationError } from 'apollo-server-errors';
import { MovieReview } from '../../models/movieReview';
import { User } from '../../models/user';
import { getApiUrl } from '../../config/apiURL';
import {
  Context,
  MovieReviewDocument,
  UserDocument,
  MovieReviewReturnType,
  DeleteReviewReturnType,
} from '../../types/graphql';
import { Resolvers } from '../../types/generated';

export const movieReviewResolvers: Resolvers = {
  Query: {
    // todo check user return
    getAllMovieReviews: async (
      _,
      __,
      context: Context
    ): Promise<MovieReviewReturnType[]> => {
      if (!context || !context.user) {
        throw new AuthenticationError(`NO token`);
      }
      try {
        const {
          user: { _id },
        } = context.user;

        const movieReviews = await MovieReview.find({ userId: _id });
        return movieReviews.map((review) => ({
          _id: review._id.toString(),
          movieId: review.movieId,
          rating: review.rating,
          reviewText: review.reviewText,
          user: null as any, // Will be populated by the user resolver
        }));
      } catch (error) {
        throw new Error(`Error getting all movie reviews: ${error.message}`);
      }
    },

    getMovieReviewByMovieId: async (
      _,
      { movieId },
      context: Context
    ): Promise<MovieReviewReturnType[]> => {
      // if (!context || !context.user) {
      //   throw new AuthenticationError(`NO token`);
      // }

      //   const {
      //     user: { _id },
      //   } = context.user;

      const movieReviews = await MovieReview.find({ movieId });

      if (!movieReviews || movieReviews.length === 0) {
        return [];
      }

      // const users = await User.find({ _id: { $in: movieReviews.map((review) => review.userId) } });

      console.log('movieReviews', movieReviews);

      // type MovieReview {
      //   _id: ID
      //   movieId: String!
      //   rating: Int!
      //   reviewText: String
      //   user: User!
      // }
      const moviesWithUser = await Promise.all(
        movieReviews.map(async (review) => {
          const user = await User.findById(review.userId);
          return {
            _id: review._id.toString(),
            userId: review.userId,
            movieId: review.movieId,
            rating: review.rating,
            reviewText: review.reviewText,
            user,
          };
        })
      );
      console.log('moviesWithUser', moviesWithUser);
      return moviesWithUser;
    },

    getGraphqlPopularMovies: async (_, { pageNumber }) => {
      try {
        const page = pageNumber || 1;
        const apiUrl = getApiUrl(page);

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch from TMDB');
        }

        const data = await response.json();
        return {
          results: data.results,
          total_pages: data.total_pages,
          total_results: data.total_results,
        };
      } catch (error) {
        throw new Error(`Error fetching popular movies: ${error.message}`);
      }
    },
  },

  Mutation: {
    // parent, args, context
    // TODO: add the context here for userID
    createMovieReview: async (
      _,
      { movieId, rating, reviewText, userId },
      context: Context
    ): Promise<MovieReviewReturnType> => {
      if (!context || !context.user) {
        throw new AuthenticationError(`NO token`);
      }

      const {
        user: { _id },
      } = context.user;
      const user = await User.findById(userId).select('-password');

      if (user._id.toString() !== _id.toString()) {
        throw new Error('You are not LOGGED IN');
      }

      const existingReview = await MovieReview.findOne({ movieId, userId });

      if (existingReview) {
        throw new Error('You have already reviewed this movie');
      }

      if (!userId) {
        throw new Error('User ID is required');
      }

      if (!movieId) {
        throw new Error('Movie ID is required');
      }

      if (!rating) {
        throw new Error('Rating is required');
      }

      try {
        const movieReview = await MovieReview.create({
          movieId,
          rating,
          reviewText,
          userId,
        });

        return {
          _id: movieReview._id.toString(),
          movieId: movieReview.movieId,
          rating: movieReview.rating,
          reviewText: movieReview.reviewText,
          user,
        };
      } catch (error) {
        throw new Error(`Error creating movie review: ${error.message}`);
      }
    },

    deleteMovieReview: async (
      _,
      { reviewId },
      context: Context
    ): Promise<DeleteReviewReturnType> => {
      if (!context || !context.user) {
        throw new AuthenticationError('User not authenticated');
      }

      const {
        user: { _id },
      } = context.user;

      try {
        const movieReview = await MovieReview.findOne({ _id: reviewId });

        if (!movieReview) {
          throw new Error('Movie review not found');
        }

        if (movieReview.userId !== _id) {
          throw new Error(
            'You do not have permission to delete this movie review'
          );
        }

        await MovieReview.deleteOne({ _id: reviewId });
        return { message: 'Movie review deleted successfully' };
      } catch (error) {
        throw new Error(`Error deleting movie review: ${error.message}`);
      }
    },
  },
};

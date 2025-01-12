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
    // NOTES - using this query in graphql studio to quickly access all reviews,
    // NOTES - this is not used in the frontend
    // NOTES - params - are - parent, args, context
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

        if (!movieReviews || movieReviews.length === 0) {
          return [];
        }

        const moviesWithUser = await Promise.all(
          movieReviews.map(async (review) => {
            const user = await User.findById(review.userId).select('-password');
            if (!user) {
              throw new Error('User not found');
            }
            return {
              _id: review._id.toString(),
              movieId: review.movieId,
              rating: review.rating,
              reviewText: review.reviewText || '',
              user: {
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
              },
            } as MovieReviewReturnType;
          })
        );

        return moviesWithUser;
      } catch (error) {
        throw new Error(`Error getting all movie reviews: ${error.message}`);
      }
    },

    // NOTES - fetching the reviews for a specific movie
    // this is used in the frontend to get the reviews for a specific movie using the movieId and the userId
    getMovieReviewByMovieId: async (
      _,
      { movieId },
      context: Context
    ): Promise<MovieReviewReturnType[]> => {
      const movieReviews = await MovieReview.find({ movieId });

      if (!movieReviews || movieReviews.length === 0) {
        return [];
      }

      const moviesWithUser = await Promise.all(
        movieReviews.map(async (review) => {
          const user = await User.findById(review.userId).select('-password');

          return {
            _id: review._id.toString(),
            movieId: review.movieId,
            rating: review.rating,
            reviewText: review.reviewText || '',
            user: {
              _id: user._id.toString(),
              name: user.name,
              email: user.email,
            },
          } as MovieReviewReturnType;
        })
      );
      return moviesWithUser;
    },

    // NOTES - fetching the popular movies
    // MOVED from Frontend fetch to Backend GraphQL fetch
    // this is used in the frontend to get the popular movies
    //
    getGraphqlPopularMovies: async (_, { pageNumber }, context: Context) => {
      try {
        if (!context || !context.user) {
          throw new AuthenticationError('User not authenticated');
        }
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
    // NOTES - creating a movie review
    // this is used in the frontend to create a movie review
    // parent, args, context
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

    // NOTES - deleting a movie review
    // this is used in the frontend to delete a movie review
    // ADDED the checks to the deleteMovieReview mutation
    // parent, args, context
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

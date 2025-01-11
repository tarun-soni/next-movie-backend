import mongoose from 'mongoose';
import { MovieReviewDocument } from '../types/graphql';

const movieReviewSchema = new mongoose.Schema<MovieReviewDocument>({
  userId: {
    type: String,
    required: true,
  },
  movieId: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  reviewText: {
    type: String,
    required: false,
  },
});

export const MovieReview = mongoose.model<MovieReviewDocument>(
  'MovieReview',
  movieReviewSchema
);

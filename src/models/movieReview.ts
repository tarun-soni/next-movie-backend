import mongoose from 'mongoose';

interface MovieReview {
  userId: string;
  movieId: string;
  rating: number;
  reviewText?: string;
}

const movieReviewSchema: mongoose.Schema<MovieReview> = new mongoose.Schema({
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

export const MovieReview = mongoose.model('MovieReview', movieReviewSchema);

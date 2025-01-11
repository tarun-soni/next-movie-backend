import { Document } from 'mongoose';

// Context type
export interface Context {
  user: {
    user: {
      _id: string;
      name: string;
      email: string;
      token: string;
    };
  } | null;
}

// Database Document types
export interface UserDocument extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  token: string;
}

export interface MovieReviewDocument extends Document {
  _id: string;
  movieId: string;
  rating: number;
  reviewText?: string;
  userId: string;
  user: UserDocument;
}

// GraphQL Return types
export interface UserReturnType {
  _id: string;
  name: string;
  email: string;
  token: string;
}

export interface UserWithoutTokenReturnType {
  _id: string;
  name: string;
  email: string;
}

export interface MovieReviewReturnType {
  _id: string;
  movieId: string;
  rating: number;
  reviewText?: string;
  user: UserReturnType;
}

export interface DeleteReviewReturnType {
  message: string;
}

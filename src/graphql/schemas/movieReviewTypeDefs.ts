import { gql } from 'apollo-server-core';

export const movieReviewTypeDefs = gql`
  "---all querys here---"
  type Query {
    "user queries"
    getAllMovieReviews: [MovieReview!]!
    getMovieReviewByMovieId(movieId: String!): [MovieReview!]!
  }

  "movie review schema type"
  type MovieReview {
    _id: ID
    movieId: String!
    rating: Int!
    reviewText: String
    user: User!
  }

  "---all mutations here---"
  type Mutation {
    "create movie review"
    createMovieReview(
      userId: String!
      movieId: String!
      rating: Int!
      reviewText: String
    ): MovieReview!

    "delete movie review"
    deleteMovieReview(movieId: String!): MovieReview!
  }
`;

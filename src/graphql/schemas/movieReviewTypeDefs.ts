import { gql } from 'apollo-server-core';

// NOTES - movieReviewTypeDefs is the schema for the movie review
export const movieReviewTypeDefs = gql`
  "---all querys here---"
  type Query {
    "user queries"
    getAllMovieReviews: [MovieReview]!
    getMovieReviewByMovieId(movieId: String!): [MovieReview!]!
    getGraphqlPopularMovies(pageNumber: Int): MovieType!
  }

  "movie review schema type"
  type MovieReview {
    _id: ID
    movieId: String!
    rating: Int!
    reviewText: String
    user: UserWithoutToken!
  }

  type Movie {
    adult: Boolean
    backdrop_path: String

    id: Int
    original_language: String
    original_title: String
    overview: String
    popularity: Int
    poster_path: String
    release_date: String
    title: String
    video: Boolean
    vote_average: Float
    vote_count: Int
  }

  type MovieType {
    results: [Movie!]
    total_pages: Int
    total_results: Int
  }

  type DeleteReviewResponse {
    message: String!
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
    deleteMovieReview(reviewId: String!): DeleteReviewResponse!
  }
`;

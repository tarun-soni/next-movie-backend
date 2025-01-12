import type { GraphQLResolveInfo } from 'graphql';
import type { UserReturnType, MovieReviewReturnType, DeleteReviewReturnType, Context } from './graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type DeleteReviewResponse = {
  __typename?: 'DeleteReviewResponse';
  message: Scalars['String']['output'];
};

export type Movie = {
  __typename?: 'Movie';
  adult?: Maybe<Scalars['Boolean']['output']>;
  backdrop_path?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  original_language?: Maybe<Scalars['String']['output']>;
  original_title?: Maybe<Scalars['String']['output']>;
  overview?: Maybe<Scalars['String']['output']>;
  popularity?: Maybe<Scalars['Int']['output']>;
  poster_path?: Maybe<Scalars['String']['output']>;
  release_date?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  video?: Maybe<Scalars['Boolean']['output']>;
  vote_average?: Maybe<Scalars['Float']['output']>;
  vote_count?: Maybe<Scalars['Int']['output']>;
};

/** movie review schema type */
export type MovieReview = {
  __typename?: 'MovieReview';
  _id?: Maybe<Scalars['ID']['output']>;
  movieId: Scalars['String']['output'];
  rating: Scalars['Int']['output'];
  reviewText?: Maybe<Scalars['String']['output']>;
  user: UserWithoutToken;
};

export type MovieType = {
  __typename?: 'MovieType';
  results?: Maybe<Array<Movie>>;
  total_pages?: Maybe<Scalars['Int']['output']>;
  total_results?: Maybe<Scalars['Int']['output']>;
};

/** ---all mutations here--- */
export type Mutation = {
  __typename?: 'Mutation';
  /** create movie review */
  createMovieReview: MovieReview;
  /** register or create user */
  createUser: User;
  /** delete movie review */
  deleteMovieReview: DeleteReviewResponse;
  /** returns string bascically the jwt token */
  login: User;
};


/** ---all mutations here--- */
export type MutationCreateMovieReviewArgs = {
  movieId: Scalars['String']['input'];
  rating: Scalars['Int']['input'];
  reviewText?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
};


/** ---all mutations here--- */
export type MutationCreateUserArgs = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


/** ---all mutations here--- */
export type MutationDeleteMovieReviewArgs = {
  reviewId: Scalars['String']['input'];
};


/** ---all mutations here--- */
export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

/** ---all querys here--- */
export type Query = {
  __typename?: 'Query';
  /** user queries */
  getAllMovieReviews: Array<Maybe<MovieReview>>;
  /** user queries */
  getCurrentUser: User;
  getGraphqlPopularMovies: MovieType;
  getMovieReviewByMovieId: Array<MovieReview>;
};


/** ---all querys here--- */
export type QueryGetGraphqlPopularMoviesArgs = {
  pageNumber?: InputMaybe<Scalars['Int']['input']>;
};


/** ---all querys here--- */
export type QueryGetMovieReviewByMovieIdArgs = {
  movieId: Scalars['String']['input'];
};

/** user schema type */
export type User = {
  __typename?: 'User';
  _id: Scalars['ID']['output'];
  email: Scalars['String']['output'];
  name: Scalars['String']['output'];
  token?: Maybe<Scalars['String']['output']>;
};

export type UserWithoutToken = {
  __typename?: 'UserWithoutToken';
  _id: Scalars['ID']['output'];
  email: Scalars['String']['output'];
  name: Scalars['String']['output'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  DeleteReviewResponse: ResolverTypeWrapper<DeleteReviewReturnType>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Movie: ResolverTypeWrapper<Movie>;
  MovieReview: ResolverTypeWrapper<MovieReviewReturnType>;
  MovieType: ResolverTypeWrapper<MovieType>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  User: ResolverTypeWrapper<UserReturnType>;
  UserWithoutToken: ResolverTypeWrapper<UserWithoutToken>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  DeleteReviewResponse: DeleteReviewReturnType;
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Movie: Movie;
  MovieReview: MovieReviewReturnType;
  MovieType: MovieType;
  Mutation: {};
  Query: {};
  String: Scalars['String']['output'];
  User: UserReturnType;
  UserWithoutToken: UserWithoutToken;
};

export type DeleteReviewResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DeleteReviewResponse'] = ResolversParentTypes['DeleteReviewResponse']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MovieResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Movie'] = ResolversParentTypes['Movie']> = {
  adult?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  backdrop_path?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  original_language?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  original_title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  overview?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  popularity?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  poster_path?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  release_date?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  video?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  vote_average?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  vote_count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MovieReviewResolvers<ContextType = Context, ParentType extends ResolversParentTypes['MovieReview'] = ResolversParentTypes['MovieReview']> = {
  _id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  movieId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rating?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  reviewText?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['UserWithoutToken'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MovieTypeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['MovieType'] = ResolversParentTypes['MovieType']> = {
  results?: Resolver<Maybe<Array<ResolversTypes['Movie']>>, ParentType, ContextType>;
  total_pages?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  total_results?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createMovieReview?: Resolver<ResolversTypes['MovieReview'], ParentType, ContextType, RequireFields<MutationCreateMovieReviewArgs, 'movieId' | 'rating' | 'userId'>>;
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'email' | 'name' | 'password'>>;
  deleteMovieReview?: Resolver<ResolversTypes['DeleteReviewResponse'], ParentType, ContextType, RequireFields<MutationDeleteMovieReviewArgs, 'reviewId'>>;
  login?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'email' | 'password'>>;
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getAllMovieReviews?: Resolver<Array<Maybe<ResolversTypes['MovieReview']>>, ParentType, ContextType>;
  getCurrentUser?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  getGraphqlPopularMovies?: Resolver<ResolversTypes['MovieType'], ParentType, ContextType, Partial<QueryGetGraphqlPopularMoviesArgs>>;
  getMovieReviewByMovieId?: Resolver<Array<ResolversTypes['MovieReview']>, ParentType, ContextType, RequireFields<QueryGetMovieReviewByMovieIdArgs, 'movieId'>>;
};

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserWithoutTokenResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserWithoutToken'] = ResolversParentTypes['UserWithoutToken']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = Context> = {
  DeleteReviewResponse?: DeleteReviewResponseResolvers<ContextType>;
  Movie?: MovieResolvers<ContextType>;
  MovieReview?: MovieReviewResolvers<ContextType>;
  MovieType?: MovieTypeResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserWithoutToken?: UserWithoutTokenResolvers<ContextType>;
};


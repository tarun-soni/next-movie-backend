const BASE_URL = 'https://api.themoviedb.org/3';

export const getApiUrl = (page: number) => {
  const API_KEY_FROM_ENV = process.env.TMDB_API_KEY;

  return `${BASE_URL}/movie/popular?api_key=${API_KEY_FROM_ENV}&language=en-US&page=${page}`;
};

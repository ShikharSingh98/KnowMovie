const movieContainer = document.getElementById('movies-container');
const loader = document.getElementById('loader');

const baseURL = `https://api.themoviedb.org/3/movie`;

let movies = [];

function loading() {
  movieContainer.hidden = true;
  loader.hidden = false;
}

function completed() {
  movieContainer.hidden = false;
  loader.hidden = true;
}

function createMovieCard(movie) {
  const { id, poster_path } = movie;

  const img = document.createElement('img');
  img.setAttribute('src', `https://image.tmdb.org/t/p/w500${poster_path}`);
  img.dataset.movieId = id;

  movieContainer.append(img);
}

function displayMovieCard() {
  movies.forEach((movie) => {
    createMovieCard(movie);
  });
  completed();
}

async function getAllPopularMovies() {
  loading();
  const response = await fetch(`${baseURL}/popular?language=en-US&page=1`, {
    headers: {
      authorization: `Bearer ${API_KEY}`,
    },
  });
  const data = await response.json();
  movies = data.results;
  displayMovieCard();
}

getAllPopularMovies();

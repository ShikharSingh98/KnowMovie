const movieContainer = document.getElementById('movies-container');
const loader = document.getElementById('loader');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('close-modal');
const trailerVideo = document.getElementById('trailer-video');
const movieName = document.getElementById('movie-name');
const rating = document.getElementById('rating');
const overview = document.getElementById('overview');

const baseURL = `https://api.themoviedb.org/3/movie`;

let movies = [];

let selectedMovie = null;

async function getDataFromApi(additionalUrl) {
  loading();
  const response = await fetch(`${baseURL}${additionalUrl}`, {
    headers: {
      authorization: `Bearer ${API_KEY}`,
    },
  });
  const data = await response.json();
  if (data.results) return data.results;
  return data;
}

function loading() {
  movieContainer.hidden = true;
  loader.hidden = false;
}

function completed() {
  movieContainer.hidden = false;
  loader.hidden = true;
}

closeModal.addEventListener('click', function () {
  modal.classList.remove('show-modal');
});

window.addEventListener('click', function (event) {
  event.target === modal ? modal.classList.remove('show-modal') : false;
});

function displayRating(vote_average) {
  const calculatedRating = (vote_average * 5) / 10;
  const numberOfStars = Math.trunc(calculatedRating);
  const decimalValue = Math.trunc((calculatedRating * 10) % 10);

  let ratingData = '';

  for (let i = 0; i < numberOfStars; i++) {
    ratingData += '<i class="fas fa-star"></i>';
  }

  if (decimalValue >= 4 && decimalValue <= 7) {
    ratingData += '<i class="fas fa-star-half"></i>';
  }

  rating.innerHTML = ratingData;
}

async function openModal(event) {
  modal.classList.add('show-modal');
  selectedMovie = await getDataFromApi(
    `/${event.target.dataset.movieId}?append_to_response=videos`
  );

  if (selectedMovie.videos.results.length) {
    const movieTrailerVideo = selectedMovie.videos.results.find(
      (movie) => movie.type === 'Trailer' || movie.type === 'Teaser'
    );
    trailerVideo.setAttribute(
      'src',
      `https://www.youtube.com/embed/${movieTrailerVideo.key}`
    );
  }
  movieName.textContent = selectedMovie.title;
  displayRating(selectedMovie.vote_average);
  overview.textContent = selectedMovie.overview;
}

function createMovieCard(movie) {
  const { id, poster_path } = movie;

  const img = document.createElement('img');
  img.setAttribute('src', `https://image.tmdb.org/t/p/w500${poster_path}`);
  img.dataset.movieId = id;
  img.addEventListener('click', openModal);
  movieContainer.append(img);
}

async function displayMovieCard() {
  movies = await getDataFromApi('/popular?language=en-US&page=1');
  movies.forEach((movie) => {
    createMovieCard(movie);
  });
  completed();
}

displayMovieCard();

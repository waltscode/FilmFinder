$(document).ready(function () {

  var movieId = extractMovieIdFromUrl();

  function extractMovieIdFromUrl() {
    var queryParams = new URLSearchParams(window.location.search);
    return queryParams.get("id");
  }

  function fetchMovieDetails(movieId) {
    var apiUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=b959be3036efe07cdd94c9fb04a40299`;

    fetch(apiUrl)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        displayMovieDetails(data);
      })
      .catch(function(error) {
        console.error(error);
      });
  }

  function displayMovieDetails(movie) {
    var detailsContainer = $("#movie-details-container");
    var movieCard = createMovieCard(movie);
    detailsContainer.append(movieCard);
  }

  function createMovieCard(movie) {
    var movieCard = $("<div>").addClass("movie-card");
    var posterBox = $("<div>").addClass("poster-box");
    var image = $("<img>").attr("src", `https://image.tmdb.org/t/p/w400${movie.poster_path}`);
    var detailsBox = $('<div>').addClass("details-box");
    var title = $("<h2>").text(movie.title);
    var releaseDate = $("<h2>").text("Release Date: " + formatReleaseDate(movie.release_date));
    var rating = $("<h2>").text("Rating: " + movie.vote_average + "/10");
    var description = $("<p>").text(movie.overview);

    var addToWatchlistBtn = $('<button class="add-to-watchlist-btn">Add to Watchlist</button>');
    addToWatchlistBtn.on("click", function () {
      addToWatchlist(movie);
      this.innerText = "Added to Watchlist";
    });

    movieCard.append(posterBox, detailsBox);
    posterBox.append(image);
    detailsBox.append(title, releaseDate, rating, description, addToWatchlistBtn);

    return movieCard;
  }

  function addToWatchlist(movie) {
    var watchlist = getWatchlistFromLocalStorage();
    var isMovieInWatchlist = watchlist.some(function(item) {
      return item.id === movie.id;
    });

    if (!isMovieInWatchlist) {
      watchlist.push(movie);
      updateWatchlistInLocalStorage(watchlist);
    }
  }

  function getWatchlistFromLocalStorage() {
    return JSON.parse(localStorage.getItem("watchlist")) || [];
  }

  function updateWatchlistInLocalStorage(watchlist) {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }

  function formatReleaseDate(dateString) {
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    var formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
  }

  fetchMovieDetails(movieId);
});
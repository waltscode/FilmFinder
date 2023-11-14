// Execute code when the document is fully loaded
$(document).ready(function() {

// Selecting elements using jQuery
var btnEl = $(".btn");
var movieDetailsContainer = $("#movie-details-container");

  // Attach a click event handler to the button element
  btnEl.on('click', function(event) {
    event.preventDefault(); // Prevent the default behavior of the button

    // Get the user's input for the movie name
    var inputValue = $('#movie-name');

    // Construct the API request URL with the user's input
    var requestUrl = `https://api.themoviedb.org/3/search/movie?api_key=b959be3036efe07cdd94c9fb04a40299&query=${inputValue.val()}`;

    // Fetch data from the API using the constructed URL
    fetch(requestUrl)
      .then(function(response) {
        console.log(response);
        if (response.status === 404) {
          // Handle 404 response
          throw new Error('Movie not found');
        }
        return response.json(); // Parse the response as JSON
      })
      .then(function(data) {
        console.log(data);
        // Check if there's a movie result
        if (data.results.length > 0) {
          var moviesContainer = $('<div class="movies-container"></div>');

          // Loop through the first 12 results or less
          for (var i = 0; i < Math.min(12, data.results.length); i++) {
            createMovieElement(data.results[i], moviesContainer);
          }

          movieDetailsContainer.html(moviesContainer);
          inputValue.val(''); // Clear the input value
          popularMoviesContainer.html('');
          movieGenresEl.html('');
        } else {
          movieDetailsContainer.html('No movies found.');
        }

      })
      .catch(function(err) {
        console.log(err.message); // Handle any errors, including 404
        if (err.message === 'Movie not found') {
          movieDetailsContainer.html('Movie not found.');
        } else {
          // Handle other errors
        }
      });
  });

// Function to create and append elements to display movie details
function createMovieElement(movie, container) {
  // Create a card-like structure for the movie
  var movieCard = $('<div class="movie-card"></div>');

  // Create a box to hold the movie poster
  var posterBox = $('<div class="poster-box"></div>');
  var image = $("<img>").attr(
    "src",
    "https://image.tmdb.org/t/p/w200" + movie.poster_path
  );
  posterBox.append(image);

  // Create a box for movie details (title and description)
  var detailsBox = $('<div class="details-box"></div>');
  var title = $("<h2>").text(movie.title);
  var description = $("<p>").text(movie.overview);
  detailsBox.append(title);
  // Create a button to add the movie to the watchlist
  var addToWatchlistBtn = $(
    '<button class="add-to-watchlist-btn">Add to Watchlist</button>'
  );
  addToWatchlistBtn.on("click", function () {
    addToWatchlist(movie);
  });

  // Append the poster box and details box to the movie card
  movieCard.append(posterBox, detailsBox, addToWatchlistBtn);

  // Append the movie card to the container
  container.append(movieCard);
}

var movieGenresEl = $(".movie-genres");
var genreBtns = [
  { id: "#action-btn", genreId: 28 },
  { id: "#adventure-btn", genreId: 12 },
  { id: "#comedy-btn", genreId: 35 },
  { id: "#drama-btn", genreId: 18 },
  { id: "#horror-btn", genreId: 27 },
  { id: "#romance-btn", genreId: 10749 },
  { id: "#thriller-btn", genreId: 53 },
  { id: "#western-btn", genreId: 37 },
];

function fetchAndDisplayMovies(genre, genreId) {
  // Define the URL for the API request
  var apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=b959be3036efe07cdd94c9fb04a40299&with_genres=${genreId}`;

  // Make an API request and handle the response
  fetch(apiUrl)
    .then(function (response) {
      console.log(response);
      if (response.status === 404) {
        // Handle 404 response
        throw new Error("Movies not found");
      }
      return response.json(); // Parse the JSON response
    })
    .then(function (data) {
      console.log(data);
      // Check if there are movie results
      if (data.results.length > 0) {
        var moviesContainer = $('<div class="movies-container"></div>');

        // Loop through the array of movie data in the API response
        data.results.forEach(function (movie) {
          var movieCard = $('<div class="movie-card"></div>');
          var posterBox = $('<div class="poster-box"></div>');
          var image = $("<img>").attr(
            "src",
            "https://image.tmdb.org/t/p/w200" + movie.poster_path
          );
          posterBox.append(image);

          var detailsBox = $('<div class="details-box"></div>');
          var title = $("<h2>").text(movie.title);
          var description = $("<p>").text(movie.overview);
          detailsBox.append(title);
          var addToWatchlistBtn = $(
            '<button class="add-to-watchlist-btn">Add to Watchlist</button>'
          );
          addToWatchlistBtn.on("click", function () {
            addToWatchlist(movie);
            this.innerText = "Added to Watchlist";
          });

          movieCard.append(posterBox, detailsBox, addToWatchlistBtn);
          moviesContainer.append(movieCard);
        });

        // Replace the content of the genre element with the movies container
        genre.html(moviesContainer);
      } else {
        // Handle the case where no movies are found
        genre.html("No movies found.");
      }
    })
    .catch(function (err) {
      console.log(err.message); // Handle any errors, including 404
      if (err.message === "Movies not found") {
        genre.html("No movies found.");
      } else {
        // Handle other errors
      }
    });
}

genreBtns.forEach(function (button) {
  $(button.id).on("click", function (event) {
    event.preventDefault();
    fetchAndDisplayMovies(movieGenresEl, button.genreId);
  });
});

function addToWatchlist(movie) {
  // Retrieve the existing watchlist from local storage (if any)
  var watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

  // Check if the movie is already in the watchlist
  var isMovieInWatchlist = watchlist.some(function (item) {
    return item.id === movie.id;
  });

  // Add the movie to the watchlist
  watchlist.push(movie);
  // Save the updated watchlist back to local storage
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
}

  // --- Function for displaying popular movies --- //
  var popularMoviesContainer = $('#popular-movies-container .popular-movies');

  // Function to fetch and display popular movies
  function fetchAndDisplayPopularMovies() {
    var popularMoviesUrl = `https://api.themoviedb.org/3/movie/popular?api_key=b959be3036efe07cdd94c9fb04a40299`;

    fetch(popularMoviesUrl)
      .then(function (response) {
        if (response.status === 404) {
          throw new Error('Popular movies not found');
        }
        return response.json();
      })
      .then(function (data) {
        if (data.results.length > 0) {
          var moviesContainer = $('<div class="movies-container"></div>');
          for (var i = 0; i < Math.min(4, data.results.length); i++) {
            createMovieElement(data.results[i], moviesContainer);
          }
          popularMoviesContainer.html(moviesContainer);
        } else {
          popularMoviesContainer.html('No popular movies found.');
        }
      })
      .catch(function (err) {
        console.log(err.message);
        if (err.message === 'Popular movies not found') {
          popularMoviesContainer.html('No popular movies found.');
        } else {
          // Handle other errors
        }
      });
  }

  fetchAndDisplayPopularMovies();
});
// Selecting elements using jQuery
var searchBtnEl = $("#search-btn");
var movieDetailsContainerEl = $("#movie-details-container");
var movieGenresEl = $(".movie-genres");
var carouselContainerEl = $(".large-carousel-box")
var genreBtnsContainerEl = $("#genre-btns-container")

// Array of genre buttons with their corresponding IDs and genre IDs
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

// Execute code when the document is fully loaded
$(document).ready(function() {
  // Attach a click event handler to the search button
  searchBtnEl.on('click', function(event) {
    event.preventDefault(); // Prevent the default behavior of the button

    // Get the user's input for the movie name
    var inputValue = $('#movie-name');
    // Construct the API request URL with the user's input
    var requestUrl = `https://api.themoviedb.org/3/search/movie?api_key=b959be3036efe07cdd94c9fb04a40299&query=${inputValue.val()}`;

    // Fetch data from the API using the constructed URL
    fetch(requestUrl)
      .then(function(response) {
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
          // Loop through the first 20 results or less
          for (var i = 0; i < Math.min(20, data.results.length); i++) {
            createMovieElement(data.results[i], moviesContainer);
          }
          movieDetailsContainerEl.html(moviesContainer);
          inputValue.val(''); // Clear the input value
          movieGenresEl.html('');
          carouselContainerEl.html('');
          genreBtnsContainerEl.html('');
        } else {
          movieDetailsContainerEl.html('No movies found.');
        }
      })
      .catch(function(err) {
        console.log(err.message); // Handle any errors, including 404
        if (err.message === 'Movie not found') {
          movieDetailsContainerEl.html('Movie not found.');
        } else {
          // Handle other errors
        }
      });
  });

  // Function to create and append elements to display movie details
  function createMovieElement(movie, container) {
    var movieCard = $("<div>").addClass("movie-card");
    var posterBox = $("<div>").addClass("poster-box");
    var image = $("<img>").attr("src", `https://image.tmdb.org/t/p/w200${movie.poster_path}`);
    var detailsBox = $('<div>').addClass("details-box");
    var title = $("<h2>").text(movie.title);
    var posterLink = $("<a>").attr("href", `movie-details.html?id=${movie.id}`);

    var addToWatchlistBtn = $('<button class="add-to-watchlist-btn">Add to Watchlist</button>');
    addToWatchlistBtn.on("click", function () {
      addToWatchlist(movie);
      this.innerText = "Added to Watchlist";
      this.classList.add("added-to-watchlist");
    });
    // Append elements to the movie card
    movieCard.append(posterBox, detailsBox, addToWatchlistBtn);
    posterBox.append(posterLink); 
    posterLink.append(image);
    detailsBox.append(title);
    // Append the movie card to the container
    container.append(movieCard);
  }

  // Function to fetch and display movies based on genre
  function fetchAndDisplayMovies(genre, genreId) {
    // URL for the API request
    var apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=b959be3036efe07cdd94c9fb04a40299&with_genres=${genreId}`;

    // Make an API request and handle the response
    fetch(apiUrl)
      .then(function (response) {
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
          var moviesContainer = $('<div>').addClass("movies-container");

          // Loop through the array of movie data in the API response
          data.results.forEach(function (movie) {
            var movieCard = $("<div>").addClass("movie-card");
            var posterBox = $("<div>").addClass("poster-box");
            var image = $("<img>").attr("src", `https://image.tmdb.org/t/p/w200${movie.poster_path}`);
            var detailsBox = $('<div>').addClass("details-box");
            var title = $("<h2>").text(movie.title);
            var description = $("<p>").text(movie.overview);
            var posterLink = $("<a>").attr("href", `movie-details.html?id=${movie.id}`);
            
            var addToWatchlistBtn = $('<button class="add-to-watchlist-btn">Add to Watchlist</button>');
            addToWatchlistBtn.on("click", function () {
              addToWatchlist(movie);
              this.innerText = "Added to Watchlist";
              this.classList.add("added-to-watchlist");
            });
            // Append elements to the movie card
            movieCard.append(posterBox, detailsBox, addToWatchlistBtn);
            posterBox.append(posterLink); 
            posterLink.append(image);
            detailsBox.append(title);
            // Append the movie card to the container
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

  // Function to add a movie to the watchlist
  function addToWatchlist(movie) {
    // Retrieve the existing watchlist from local storage (if any)
    var watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

    // Check if the movie is already in the watchlist
    var isMovieInWatchlist = watchlist.some(function (item) {
      return item.id === movie.id;
    });

    // If the movie is not a duplicate, add it to the watchlist
    if (!isMovieInWatchlist) {
      watchlist.push(movie);
      // Update local storage
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
    }
  }

  // Attach click event handlers to genre buttons
  genreBtns.forEach(function (button) {
    $(button.id).on("click", function (event) {
      event.preventDefault();

      // Fetch and display movies for the clicked genre
      fetchAndDisplayMovies(movieGenresEl, button.genreId);

      // Scroll to the target genre content section
      $('html, body').animate({
        scrollTop: $(movieGenresEl).offset().top
      }, 10); 
    });
  });

  // Attach keyup event listener to the input field
  $('#movie-name').on('keyup', function(event) {
    // Check if the pressed key is Enter (key code 13)
    if (event.keyCode === 13) {
      // Trigger the click event on the link
      searchBtnEl.click();
    }
  })
});
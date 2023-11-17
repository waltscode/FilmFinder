$(document).ready(function () {

  // Selecting elements using jQuery
  var clearStorageBtnEl = $('#clear-storage-btn');
  var watchlistContainer = $(".watchlist-container");

  // Load the watchlist on the watchlist page
  function loadWatchlist() {
    // Retrieve the watchlist from local storage or use an empty array if it doesn't exist
    var watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

    // Iterate through each movie in the watchlist and create a movie card for it
    $.each(watchlist, function (index, movie) {
      var movieCard = createMovieCard(movie);
      // Append the movie card to the watchlist container
      watchlistContainer.append(movieCard);

      // Add a click event handler to the movie card
      movieCard.on('click', function () {
        // Get the movie details page URL
        var movieDetailsPageUrl = `movie-details.html?id=${movie.id}`;
        // Navigate to the movie details page
        window.location.href = movieDetailsPageUrl;
      });
    });
  }

  // Function to create a movie card for the watchlist
  function createMovieCard(movie) {
    // Create a div element with the "movie-card" class
    var movieCard = $("<div>").addClass("movie-card");
    // Create a div element with the "poster-box" class
    var posterBox = $("<div>").addClass("poster-box");
    // Create an img element with the poster path obtained from the movie data
    var image = $("<img>").attr("src", `https://image.tmdb.org/t/p/w200${movie.poster_path}`);
    // Create a div element with the "details-box" class
    var detailsBox = $('<div>').addClass("details-box");
    // Create an h2 element with the movie title
    var title = $("<h2>").text(movie.title);
    // Create a h2 element with the movie release date
    var releaseDate = $(`<h2><span class="underline">Release Date:</span> ${formatReleaseDate(movie.release_date)}</h2>`);
    // Create a h2 element with the movie rating
    var roundedRating = Math.round(movie.vote_average * 10) / 10;
    var rating = $(`<h2><span class="underline">Rating:</span> ${roundedRating}/10</h2>`);
    // Create a p element with the movie overview/description
    var description = $("<p>").text(movie.overview);

    // Append elements to the movie card
    movieCard.append(posterBox, detailsBox);
    posterBox.append(image);
    detailsBox.append(title, description);

    // Return the created movie card
    return movieCard;
  }

  // Function to format the release date
  function formatReleaseDate(dateString) {
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    // Parse the input date string and format it
    var formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
  }

  // Function to clear local storage and reload the watchlist
  function clearLocalStorage() {
    // Clear local storage
    localStorage.clear();
    // Empty the watchlist container
    watchlistContainer.empty();
    // Reload the watchlist
    loadWatchlist();
  }

  // Event handler for clicking the clear button
  clearStorageBtnEl.on('click', function (event) {
    // Prevent the default button click behavior
    event.preventDefault();
    // Clear local storage and reset the watchlist
    clearLocalStorage();
  });

  // Call the loadWatchlist function when the watchlist page loads
  loadWatchlist();
});
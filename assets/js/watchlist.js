$(document).ready(function() {

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
    });
  }

  // Function to create a movie card for the watchlist with a remove button
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
    var releaseDate = $("<h2>").text("Release Date: " + formatReleaseDate(movie.release_date));
    // Create a h2 element with the movie rating
    var rating = $("<h2>").text("Rating: " + movie.vote_average + "/10");
    // Create a p element with the movie overview/description
    var description = $("<p>").text(movie.overview);

    // Create a button for removing the movie from the watchlist
    var removeButton = $("<button>").text("Remove from Watchlist").addClass("remove-btn");

    // Append elements to the movie card
    movieCard.append(posterBox, detailsBox);
    posterBox.append(image);
    detailsBox.append(title, releaseDate, rating, description, removeButton);

    // Add a click event to the remove button
    removeButton.on('click', function() {
      // Remove the movie from the watchlist array
      removeFromWatchlist(movie.id);
      // Remove the movie card from the DOM
      movieCard.remove();
    });

    // Return the created movie card
    return movieCard;
  }

  // Function to remove a movie from the watchlist
  function removeFromWatchlist(movieId) {
    // Retrieve the watchlist from local storage
    var watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

    // Find the index of the movie with the specified ID in the watchlist array
    var index = watchlist.findIndex(function(movie) {
      return movie.id === movieId;
    });

    // If the movie is found, remove it from the watchlist array
    if (index !== -1) {
      watchlist.splice(index, 1);
      // Update the local storage with the modified watchlist
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
    }
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
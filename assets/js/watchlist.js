// Load the watchlist on the watchlist page
function loadWatchlist() {
  var watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

  var watchlistContainer = document.querySelector(".watchlist-container"); // Adjust the selector as needed

  watchlist.forEach(function (movie) {
    var movieCard = createMovieCard(movie); // Create a movie card element
    watchlistContainer.appendChild(movieCard);
  });
}

// Call the loadWatchlist function when the watchlist page loads
loadWatchlist();

// Function to create a movie card for the watchlist
function createMovieCard(movie) {
  var movieCard = document.createElement("div");
  movieCard.className = "movie-card"; // You may need to adjust the class name


  // Create elements to display movie details (title, poster, etc.)
  var posterBox = document.createElement("div");
  posterBox.className = "poster-box"; // You may need to adjust the class name
  var image = document.createElement("img");
  image.src = "https://image.tmdb.org/t/p/w200" + movie.poster_path;

  var detailsBox = document.createElement("div");
  detailsBox.className = "details-box"; // You may need to adjust the class name
  var title = document.createElement("h2");
  title.textContent = movie.title;
  var description = document.createElement("p");
  description.textContent = movie.overview;

  // Append elements to the movie card
  posterBox.appendChild(image);
  detailsBox.appendChild(title);
  detailsBox.appendChild(description);
  movieCard.appendChild(posterBox);
  movieCard.appendChild(detailsBox);

  return movieCard;
}

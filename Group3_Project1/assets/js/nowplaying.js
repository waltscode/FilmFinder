var searchBtnEl = $("#search-btn");
var movieDetailsContainerEl = $("#movie-details-container");
var nowplayingEl = $(".nowplaying-movies");

$(document).ready(function() {

function fetchAndDisplayMovies(nowplaying) {
    // URL for the API request
    var apiUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=b959be3036efe07cdd94c9fb04a40299`;

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
          nowplaying.html(moviesContainer);
        } else {
          // Handle the case where no movies are found
          nowplaying.html("No movies found.");
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


  // Call the function when the page loads
  window.onload = fetchAndDisplayMovies(nowplayingEl);

})
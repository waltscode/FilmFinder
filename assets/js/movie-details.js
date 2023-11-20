$(document).ready(function () {
  // Extract movie ID from the URL using query parameters
  var movieId = extractMovieIdFromUrl();

  // Use URLSearchParams to get the 'id' parameter from the URL
  function extractMovieIdFromUrl() {
    var queryParams = new URLSearchParams(window.location.search);
    return queryParams.get("id");
  }

  // Fetch details for the specified movie ID from The Movie Database API
  function fetchMovieDetails(movieId) {
    var apiUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=b959be3036efe07cdd94c9fb04a40299`;

    // Fetch data from the API and handle the response
    fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      // Display movie details and log the data
      .then(function (data) {
        displayMovieDetails(data);
        console.log(data)
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  // Create a movie card with details and streaming sources
  function createMovieCard(movie, streamingSources) {
    // DOM elements for various movie details
    var image = $("<img>").attr("src", `https://image.tmdb.org/t/p/w400${movie.poster_path}`);
    var title = $("<h2>").text(movie.title);
    var tagline = $("<h2>").text(movie.tagline)
    var releaseDate = $(`<h2><span class="underline">Release Date:</span> ${formatReleaseDate(movie.release_date)}</h2>`);
    var runtime = $("<h2>").html(`<span class="underline">Runtime:</span> ${movie.runtime} Minutes`);
    var roundedRating = Math.round(movie.vote_average * 10) / 10;
    var rating = $(`<h2><span class="underline">Rating:</span> ${roundedRating}/10</h2>`);
    var description = $("<p>").text(movie.overview);
    var streamingTitle = $("<h2>").html('<span class="underline">Watch Now:</span>');
    var streamingList = $('<ul>');
    var movieCard2 = $("<div>").addClass("movie-card2");
    var posterBox2 = $("<div>").addClass("poster-box2");
    var detailsBox2 = $('<div>').addClass("details-box2");

    // Check if streaming sources are available and create a list
    if (streamingSources && streamingSources.length > 0) {
      var uniqueSourceNames = [];

      // Iterate through streaming sources and create list items
      streamingSources.forEach(function (source) {
        if (!uniqueSourceNames.includes(source.name)) {
          var providerIconClass = getFontAwesomeClassForProvider(source.name);
          var streamingItem = $('<li>').html(`<a href="${source.url}" target="_blank"><span class="streaming-text">${source.name}</span><i class="${providerIconClass}"></i></a>`);

          // Create a list item with a link to the streaming source
          streamingList.append(streamingItem);
          uniqueSourceNames.push(source.name);
        }
        streamingList.css({
          'display': 'flex',
          'flexWrap': 'wrap',
          'gap': '2px',
          'flexDirection': 'column',
        });
      });
    } else {
      // Display a message if no streaming providers are available
      var noStreamingProvidersMessage = $('<p>').text('No streaming providers available for this movie.');
      streamingList.append(noStreamingProvidersMessage);
    }

    // Create a button to add the movie to the watchlist
    var addToWatchlistBtn = $('<button class="add-to-watchlist2-btn">Add to Watchlist</button>');
    addToWatchlistBtn.on("click", function () {
      // Add the movie to the watchlist and update button appearance
      addToWatchlist(movie);
      this.innerText = "Added to Watchlist";
      this.classList.add("added-to-watchlist");
    });

    // Assemble the movie card with various details
    movieCard2.append(posterBox2, detailsBox2);
    posterBox2.append(image);
    detailsBox2.append(
      title,
      tagline,
      rating,
      runtime,
      releaseDate,
      description,
      streamingTitle,
      streamingList,
      addToWatchlistBtn,
    );

    return movieCard2;
  }

  // Display movie details, including the streaming sources
  function displayMovieDetails(movie) {
    // Get the container element for displaying movie details
    var detailsContainer = $("#movie-details-container");
    // Construct the request URL for fetching streaming sources
    var requestUrl = `https://api.watchmode.com/v1/title/movie-${movieId}/sources/?apiKey=90kXI5nhg4byn08NY5ZZ9UPrFSs53kCXZ7JbLMdO`;

    // Fetch streaming sources and handle the response
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // Log the streaming sources data
        console.log(data);
        // Get unique streaming sources and create a movie card
        var streamingSources = getUniqueStreamingSources(data, 5);
        var movieCard = createMovieCard(movie, streamingSources);
        // Append the movie card to the details container
        detailsContainer.append(movieCard);

        // Display a message if no streaming providers are available
        if (!streamingSources || streamingSources.length === 0) {
          var noStreamingProvidersMessage = $('<p>').text('No streaming providers available for this movie.');
          detailsContainer.append(noStreamingProvidersMessage);
        }
      })
      .catch(function (error) {
        console.error(error);
        // Display an error message if streaming provider data cannot be fetched
        var errorMessage = $('<p>').text('Error fetching streaming provider data. Please try again later.');
        detailsContainer.append(errorMessage);
      });
  }

  // Get a limited number of unique streaming sources from the data
  function getUniqueStreamingSources(data, n) {
    // Initialize an empty array to store unique sources
    var uniqueSources = [];
    // Initialize an empty array to store source names for quick lookup
    var sourceNames = [];

    // Loop through the data array until either all unique sources are found or the end of the data is reached
    for (var i = 0; i < data.length && uniqueSources.length < n; i++) {
      // Get the current source from the data array
      var source = data[i];

      // Check if the source name is not already in the sourceNames array (i.e., it's unique)
      if (!sourceNames.includes(source.name)) {
        // Add the unique source to the uniqueSources array with relevant information (name and URL)
        uniqueSources.push({
          name: source.name,
          url: source.web_url,
        });
        // Add the source name to the sourceNames array to track uniqueness
        sourceNames.push(source.name);
      }
    }

    // Return the array of unique streaming sources
    return uniqueSources;
  }

  // Add the specified movie to the watchlist
  function addToWatchlist(movie) {
    // Get the current watchlist from local storage
    var watchlist = getWatchlistFromLocalStorage();
    // Check if the movie is already in the watchlist
    var isMovieInWatchlist = watchlist.some(function (item) {
      return item.id === movie.id;
    });

    // If the movie is not in the watchlist, add it and update local storage
    if (!isMovieInWatchlist) {
      watchlist.push(movie);
      updateWatchlistInLocalStorage(watchlist);
    }
  }

  // Get the watchlist from local storage or return an empty array
  function getWatchlistFromLocalStorage() {
    return JSON.parse(localStorage.getItem("watchlist")) || [];
  }

  // Update the watchlist in local storage with the provided array
  function updateWatchlistInLocalStorage(watchlist) {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }

  // Format the release date in a readable format
  function formatReleaseDate(dateString) {
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    var formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
  }

  // Get the FontAwesome class for a given streaming provider name
  function getFontAwesomeClassForProvider(providerName) {
    // Map streaming provider names to FontAwesome classes
    switch (providerName.toLowerCase()) {
      case 'windows store':
        return 'fab fa-windows';
      case 'vudu':
        return 'fab fa-unknown';
      case 'amazon':
        return 'fab fa-amazon';
      case 'prime video':
        return 'fab fa-amazon';
      case 'youtube':
        return 'fab fa-youtube';
      case 'itunes':
        return 'fab fa-itunes';
      case 'google play':
        return 'fab fa-google-play';
      case 'disney+':
        return 'fab fa-disney-plus';
      case 'netflix':
        return 'fab fa-netflix';
      default:
        return 'fab fa-unknown';
    }
  }

  // Fetch movie details when the document is ready
  fetchMovieDetails(movieId);
});
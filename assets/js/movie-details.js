$(document).ready(function () {
  var movieId = extractMovieIdFromUrl();

  function extractMovieIdFromUrl() {
    var queryParams = new URLSearchParams(window.location.search);
    return queryParams.get("id");
  }

  function fetchMovieDetails(movieId) {
    var apiUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=b959be3036efe07cdd94c9fb04a40299`;

    fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        displayMovieDetails(data);
        console.log(data)
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  function createMovieCard(movie, streamingSources) {
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
    var movieCard = $("<div>").addClass("movie-card");
    var posterBox = $("<div>").addClass("poster-box");
    var detailsBox = $('<div>').addClass("details-box");

    if (streamingSources && streamingSources.length > 0) {
      var uniqueSourceNames = [];

      streamingSources.forEach(function (source) {
        if (!uniqueSourceNames.includes(source.name)) {
          var providerIconClass = getFontAwesomeClassForProvider(source.name);
          var streamingItem = $('<li>').html(`<a href="${source.url}" target="_blank"><span class="streaming-text">${source.name}</span><i class="${providerIconClass}"></i></a>`);

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
      var noStreamingProvidersMessage = $('<p>').text('No streaming providers available for this movie.');
      streamingList.append(noStreamingProvidersMessage);
    }

    var addToWatchlistBtn = $('<button class="add-to-watchlist-btn">Add to Watchlist</button>');
    addToWatchlistBtn.on("click", function () {
      addToWatchlist(movie);
      this.innerText = "Added to Watchlist";
      this.classList.add("added-to-watchlist");
    });

    movieCard.append(posterBox, detailsBox);
    posterBox.append(image);
    detailsBox.append(
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

    return movieCard;
  }

  function displayMovieDetails(movie) {
    var detailsContainer = $("#movie-details-container");
    var requestUrl = `https://api.watchmode.com/v1/title/movie-${movieId}/sources/?apiKey=qfwRjVgtMJ6tlLVvSCzdAHoDCCFkufmuxkiHPLam`;

    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        var streamingSources = getUniqueStreamingSources(data, 5);
        var movieCard = createMovieCard(movie, streamingSources);
        detailsContainer.append(movieCard);

        if (!streamingSources || streamingSources.length === 0) {
          var noStreamingProvidersMessage = $('<p>').text('No streaming providers available for this movie.');
          detailsContainer.append(noStreamingProvidersMessage);
        }
      })
      .catch(function (error) {
        console.error(error);
        var errorMessage = $('<p>').text('Error fetching streaming provider data. Please try again later.');
        detailsContainer.append(errorMessage);
      });
  }

  function getUniqueStreamingSources(data, n) {
    var uniqueSources = [];
    var sourceNames = [];

    for (var i = 0; i < data.length && uniqueSources.length < n; i++) {
      var source = data[i];

      if (!sourceNames.includes(source.name)) {
        uniqueSources.push({
          name: source.name,
          url: source.web_url,
        });
        sourceNames.push(source.name);
      }
    }

    return uniqueSources;
  }

  function addToWatchlist(movie) {
    var watchlist = getWatchlistFromLocalStorage();
    var isMovieInWatchlist = watchlist.some(function (item) {
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

  function getFontAwesomeClassForProvider(providerName) {
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

  fetchMovieDetails(movieId);
});
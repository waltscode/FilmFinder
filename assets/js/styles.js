
// Enable the Bootstrap Carousel functionality
var myCarousel = new bootstrap.Carousel(document.getElementById('carouselExampleDark'), {
  interval: false // Set to false if you don't want automatic sliding
});

// Event listener for the "Next" button
document.querySelector('.carousel-control-next').addEventListener('click', function () {
  myCarousel.next();
});

// Event listener for the "Previous" button
document.querySelector('.carousel-control-prev').addEventListener('click', function () {
  myCarousel.prev();
});

// Selecting elements using jQuery
var btnEl = $('.btn'); // Select the element with class 'btn'
var movieImageEl = $('#movie-image'); // Select the element with id 'movie-image'
var movieTitleEl = $('#movie-title'); // Select the element with id 'movie-title'
var movieDescEl = $('#movie-desc'); // Select the element with id 'movie-desc'
var movieYearEl = $('#movie-year'); // Select the element with id 'movie-year'

// Event handler for the button click
btnEl.on('click', function (event) {
  event.preventDefault(); // Prevent the default behavior of the button

  // Get the user's input for the movie name
  var inputValue = $('#movie-name');

  // Construct the API request URL with the user's input
  var requestUrl = `http://www.omdbapi.com/?t=${inputValue.val()}&plot=full&apikey=trilogy`

  // Fetch data from the API using the constructed URL
  var movies = fetch(requestUrl)
    .then(function (response) {
      console.log(response); // Log the API response object
      return response.json(); // Parse the response as JSON
    })
    .then(function (data) {
      // Update the DOM with movie information from the API response
      console.log(data); // Log the parsed JSON data 
      movieTitleEl.text(data.Title); // Set movie title
      movieYearEl.text(data.Released); // Set movie release date
      movieDescEl.text(data.Plot) // Set movie description
      movieImageEl.attr('src', data.Poster) // Set movie image source
    })
    .catch(function (err) {
      console.log(err); // Handle any errors that occur during the API request
    });
});

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

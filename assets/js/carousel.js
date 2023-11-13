$(document).ready(function () {
    var requestUrl = 'https://api.themoviedb.org/3/movie/now_playing?api_key=b959be3036efe07cdd94c9fb04a40299';

    // Use an array to store the IDs of each image in each carousel
    var caraImageEls = [
        ['movie-carousel-1-1', 'movie-carousel-1-2', 'movie-carousel-1-3'],
        ['movie-carousel-2-1', 'movie-carousel-2-2', 'movie-carousel-2-3'],
        ['movie-carousel-3-1', 'movie-carousel-3-2', 'movie-carousel-3-3'],
    ];

    for (let i = 0; i < caraImageEls.length; i++) {
        $.ajax({
            url: requestUrl,
            method: 'GET',
        }).then(function (response) {
            console.log(response);

            // Iterate through the results array to get movie information
            for (let j = 0; j < caraImageEls[i].length; j++) {
                var movieIndex = Math.floor(Math.random() * response.results.length);
                var posterPath = response.results[movieIndex].poster_path;

                if (posterPath) {
                    var fullPosterPath = 'https://image.tmdb.org/t/p/original' + posterPath;
                    console.log('Full Poster Path:', fullPosterPath);
                    console.log('Image Element:', caraImageEls[i][j]);

                    // Update the source of each image
                    $('#' + caraImageEls[i][j]).attr('src', fullPosterPath);
                } else {
                    console.warn('Poster path is null or undefined for element', caraImageEls[i][j]);
                }
            }
        });
    }
});




var MyNamespace = {
    init: function () {
        var requestUrl = 'https://api.themoviedb.org/3/movie/now_playing?api_key=b959be3036efe07cdd94c9fb04a40299';
        var randomCaraMovieIds = [
            Math.floor(Math.random() * 19) + 1,
            Math.floor(Math.random() * 19) + 1,
            Math.floor(Math.random() * 19) + 1,
        ];

        var caraImageEls = [
            $(`#movie-carousel-1`),
            $(`#movie-carousel-2`),
            $(`#movie-carousel-3`),
        ];

        // Array to store promises from AJAX requests
        var ajaxRequests = [];

        for (let i = 0; i < caraImageEls.length; i++) {
            var ajaxRequest = $.ajax({
                url: requestUrl,
                method: 'GET',
            }).then(function (response) {
                console.log(response);
                console.log(response.results[0].original_title);
                console.log(response.results[13].poster_path);
                console.log(randomCaraMovieIds[i]);

                var posterPath = response.results[randomCaraMovieIds[i] - 1].poster_path;
                if (posterPath) {
                    var fullPosterPath = 'https://image.tmdb.org/t/p/original' + posterPath;

                    console.log(fullPosterPath);
                    console.log('Full Poster Path:', fullPosterPath);
                    console.log('Carousel Element:', caraImageEls[i]);
                    console.log(caraImageEls[i].length);

                    caraImageEls[i].attr('src', fullPosterPath);

                } else {
                    console.warn('Poster path is null or undefined for element', caraImageEls[i]);
                }
            });

            // Store the promise in the array
            ajaxRequests.push(ajaxRequest);
        }

        // Execute when all promises are resolved
        $.when.apply($, ajaxRequests).done(function () {
            console.log("All images loaded successfully!");
            // Add any code you want to execute after all images are loaded.
        });
    }
};

// Call your initialization function
MyNamespace.init();
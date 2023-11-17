# FilmFinder

## Description
FilmFinder is a movie database web application that allows users to search for movies, view details about them, maintain a personalized watchlist, and discover the streaming platforms for each movie.

The purpose of the project is to provide users with a convenient way to explore and track movies. Users can search for movies, add them to their watchlist, and get detailed information, including streaming sources.

### Movie Search:
- <strong>Functionality:</strong> Users can enter the name of a movie in the search bar and click the "Search" button.
- <strong>API Integration:</strong> The application interacts with The Movie Database (TMDb) API to fetch information about movies based on the user's input.

### Watchlist:
- <strong>Add to Watchlist:</strong> Users can add movies to their watchlist by clicking the "Add to Watchlist" button on individual movie cards.
- <strong>Remove from Watchlist:</strong> Users can remove movies from their watchlist by clicking the "Remove from Watchlist" button on individual movie cards.
- <strong>Local Storage:</strong> The watchlist functionality uses the local storage of the user's browser to store and retrieve the list of movies.

### Movie Details:
- <strong>Details Page:</strong> Clicking on a movie card redirects the user to a detailed page for that movie.
- <strong>Information Provided:</strong> The details page displays comprehensive information about the selected movie, including its poster, title, tagline, release date, runtime, rating, and a description.
- <strong>Streaming Sources:</strong> The page also uses WatchMode API to provide information about where the movie can be streamed, enhancing user convenience.

### Genre Filtering:
- <strong>Genre Buttons:</strong> Users can filter movies by genre using genre buttons. Clicking on a genre button fetches and displays movies belonging to that genre.

### Responsive Design:
- <strong>Bootstrap Framework:</strong> The application utilizes the Bootstrap framework for styling, ensuring a responsive and visually appealing design.
- <strong>Cross-Device Compatibility:</strong> The responsive design ensures that the application is accessible and user-friendly on various devices, including desktops, tablets, and mobile phones.

### Code Structure:
- <strong>HTML, CSS, JavaScript:</strong> The project is structured using HTML for markup, CSS for styling, and JavaScript for dynamic functionalities.
- <strong>Modular Approach:</strong> The code is organized into separate files for different pages (e.g., index.html, movie-details.html) and functionalities, following a modular and maintainable structure.

## Credits
- [TMDb API](https://developer.themoviedb.org/reference/intro/getting-started)
- [WatchMode API](https://api.watchmode.com/docs/#api-reference)
- [Font Awesome](https://fontawesome.com/icons)
import { useState } from "react";
import { MovieCard } from "../MovieCard/movie-card";
import { MovieView } from "../MovieView/movie-view";
import movieImage from "../MainView/images/images.jpeg";
import movieImage2 from "../MainView/images/shawshank.jpg";
import movieImage3 from "../MainView/images/gladiator.jpeg";

export const MainView = () => {
  const [movies, setMovies] = useState([
    {
      id: 1,
      title: "Inception",
      image: movieImage,
      director: "Christopher Nolan",
      genre: "Thriller",
      description:
        "The movie follows a professional thief who steals information by infiltrating the subconscious mind of his targets",
    },
    {
      id: 2,
      title: "The Shawshank Redemption",
      image: movieImage2,
      director: "Frank Darabont",
      genre: "Crime",
      description:
        "The movie follows a banker who is sentenced to life in Shawshank State Penitentiary for the murder of his wife and her lover",
    },
    {
      id: 3,
      title: "Gladiator",
      image: movieImage3,
      director: "Ridley Scott",
      genre: "Action",
      description:
        "The movie follows a former Roman general who seeks revenge against the corrupt emperor who murdered his family and sent him into slavery",
    },
  ]);

  const [selectedMovie, setSelectedMovie] = useState(null);
  if (selectedMovie) {
    return (
      <MovieView
        movie={selectedMovie}
        onBackClick={() => setSelectedMovie(null)}
      />
    );
  }
  if (movies.length === 0) {
    return <div>THE LIST IS EMPTY!</div>;
  }

  return (
    <div>
      {movies.map((movie) => {
        return (
          <MovieCard
            key={movie.id}
            movie={movie}
            onMovieClick={(newSelectedMovie) => {
              setSelectedMovie(newSelectedMovie);
            }}
          />
        );
      })}
    </div>
  );
};

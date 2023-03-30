import { useEffect, useState } from "react";
import { MovieCard } from "../MovieCard/movie-card";
import { MovieView } from "../MovieView/movie-view";
import movieImage from "../MainView/images/images.jpeg";
import movieImage2 from "../MainView/images/shawshank.jpg";
import movieImage3 from "../MainView/images/gladiator.jpeg";

export const MainView = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  useEffect(() => {
    fetch("https://morning-badlands-99587.herokuapp.com/movies")
      .then((response) => response.json())
      .then((data) => {
        setMovies(data);
      })
      .catch((err) => console.log(err));
    console.log(selectedMovie);
  });
  // Try passing the selectedmovie Object to the movie-view
  if (selectedMovie) {
    return (
      <MovieView
        movie={selectedMovie}
        onBackClick={() => setSelectedMovie(null)}
      />
    );
  }
  //else if (movies.length == 0) render <p>Movies list is empty</p>
  // if (movies.length === 0) {
  // Iterated the movies list to render each item on the dom
  return (
    <div>
      <ul>
        {movies.map((x) => (
          <li>
            <a href="#" onClick={() => setSelectedMovie(x)}>
              {x.Name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
  // }

  // return (
  //   <div>
  //     {movies.map((movie) => {
  //       return (
  //         <MovieCard
  //           key={movie.id}
  //           movie={movie}
  //           onMovieClick={(newSelectedMovie) => {
  //             setSelectedMovie(newSelectedMovie);
  //           }}
  //         />
  //       );
  //     })}
  //   </div>
  // );
};

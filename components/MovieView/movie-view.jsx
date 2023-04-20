import { useParams } from "react-router";
import { useNavigate } from "react-router";

export const MovieView = ({ movies }) => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const selectedMovie = movies.find((m) => m._id === movieId);

  if (!selectedMovie) {
    return <div>Movie not found</div>;
  }
  const handleBackClick = () => {
    navigate(-1);
  };
  return (
    <div>
      <div>
        <img src={selectedMovie.image} />
      </div>
      <div>
        <span>Title: </span>
        <span>{selectedMovie.Name}</span>
      </div>
      <div>
        <span> Description:</span>
        <span>{selectedMovie.Description}</span>
      </div>
      <div>
        <span> Genre:</span>
        <span>{selectedMovie.Genre.Name}</span>
      </div>
      <div>
        <span> Director:</span>
        <span>{selectedMovie.Director.Name}</span>
      </div>
      <button onClick={handleBackClick}>Back</button>
    </div>
  );
};

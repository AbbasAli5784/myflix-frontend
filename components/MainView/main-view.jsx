import { useEffect, useState } from "react";
import { MovieCard } from "../MovieCard/movie-card";
import { MovieView } from "../MovieView/movie-view";
import { LoginView } from "../LoginView/login-view";
import { SignUpView } from "../SignUpView/signup-view";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { Dropdown } from "react-bootstrap";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  Link,
  useNavigate,
  Outlet,
  useParams,
} from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { ProfileView } from "../profile-view/profile-view";
import styles from "./Mainview.module.css";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import { FavoriteMovies } from "../FavoriteMovies/favorite-movie-view";

export const MainView = () => {
  const [movies, setMovies] = useState([]);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetch("https://morning-badlands-99587.herokuapp.com/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setProfile(data);
        console.log("List of all users", profile);
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }, []);

  useEffect(() => {
    if (token) {
      fetch("https://morning-badlands-99587.herokuapp.com/movies", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setMovies(data);
          populateFavorites(data);
        })
        .catch((err) => console.log(err));
      console.log(selectedMovie);
    }
  }, [token]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    console.log("User:", user);
  }, []);

  const profileInfo = () => {
    setSelectedProfile(user);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  const populateFavorites = (movies) => {
    // console.log("This is the user: ", user.Username);
    try {
      const response = fetch(
        `https://morning-badlands-99587.herokuapp.com/users/${user.Username}/favoritemovies`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          let favoriteList = [];
          // console.log("these are the movies: ", passedMovies);
          favoriteList = movies.filter((movie) => data.includes(movie._id));

          setFavorites(favoriteList);
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (user && movies.length > 0) {
      populateFavorites(movies);
    }
  }, [user, movies]);

  const onLoggedIn = (user, token) => {
    setUser({
      _id: user._id,
      Username: user.Username,
      Email: user.Email,
      Birthday: user.Birthday,
      token: token,
    });
    setToken(token);
    console.log("User:", user);
    console.log(profile);
  };
  const HandleUserUpdate = (updatedUser) => {
    setUser({
      ...updatedUser,
      _id: user._id,
    });

    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const onFavoritesUpdated = () => {
    setUpdateFavorites(false);
  };

  const addFavoriteMovie = async (user, token, movieId) => {
    try {
      await fetch(
        `https://morning-badlands-99587.herokuapp.com/users/${user.Username}/movies/${movieId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error adding favorite movie:", error);
    }
  };

  const removeFavoriteMovie = async (user, token, movieId) => {
    try {
      console.log("trying to fetch: ", movieId);
      await fetch(
        `https://morning-badlands-99587.herokuapp.com/users/${user.Username}/movies/${movieId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error removing favorite movie:", error);
    }
  };

  const toggleFavorite = async (movie) => {
    const isFavorited = favorites.some((fav) => fav._id === movie._id);

    if (isFavorited) {
      console.log("Is movie favorited:", isFavorited);
      // Remove the movie from favorites
      console.log("movie movie object:", movie);
      await removeFavoriteMovie(user, token, movie._id);
    } else {
      // Add the movie to favorites
      await addFavoriteMovie(user, token, movie._id);
    }
    console.log("this is favorites: ", favorites);
    const updatedFavorites = isFavorited
      ? favorites.filter((fav) => fav._id !== movie._id)
      : [...favorites, movie];
    console.log("this is updateed favorites: ", updatedFavorites);

    // localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    console.log("Favorites stored in local storage:", updatedFavorites);
    console.log("Updated favorites:", updatedFavorites);
    console.log("Logging favorites", favorites);
    setFavorites(updatedFavorites);
  };
  const MoviesList = ({ movies, toggleFavorite, favorites }) => {
    return (
      <Container>
        <Row>
          {movies.map((x) => (
            <Col md={4} key={x._id}>
              <Card style={{ width: "18rem", marginBottom: "1rem" }}>
                <Card.Img
                  variant="top"
                  src={"images/" + x.ImagePath}
                  alt={x.Name}
                />
                <Card.Body>
                  <Card.Title>{x.Name}</Card.Title>
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(x);
                    }}
                  >
                    {favorites.some((favMovie) => favMovie._id === x._id) ? (
                      <FaHeart />
                    ) : (
                      <FaRegHeart />
                    )}
                  </div>
                  <Button as={Link} to={`/movies/${x._id}`} variant="primary">
                    Open
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    );
  };

  return (
    <BrowserRouter>
      <>
        <div className={styles.container}>
          <div className={styles.accountDropdown}>
            <Dropdown>
              {user && (
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  Account
                </Dropdown.Toggle>
              )}

              <Dropdown.Menu>
                {user && (
                  <Dropdown.Item as={Link} to="/profile">
                    {user.Username}
                  </Dropdown.Item>
                )}
                <Dropdown.Item
                  // onClick={populateFavorites(movies)}
                  as={Link}
                  to="/movies"
                >
                  Movies
                </Dropdown.Item>
                <Dropdown.Item
                  // onClick={populateFavorites(movies)}
                  as={Link}
                  to="/favoriteMovies"
                >
                  Favorite Movies
                </Dropdown.Item>
                <Dropdown.Item onClick={logout} as={Link} to="/login">
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </>

      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/movies" /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={
            user ? (
              <ProfileView
                user={user}
                logOut={logout}
                setUser={setUser}
                onProfileClick={profileInfo}
                currentUser={user}
                userId={user._id}
                onUserUpdate={HandleUserUpdate}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/favoriteMovies"
          element={
            user ? (
              <FavoriteMovies
                user={user}
                token={token}
                toggleFavorite={toggleFavorite}
                favorites={favorites}
                setFavorites={setFavorites}
                onFavoritesUpdated={onFavoritesUpdated}
                movies={movies}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        ></Route>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/movies" />
            ) : (
              <LoginView
                onLoggedIn={onLoggedIn}
                onNavigateToSignUp={(navigate) => navigate("/signup")}
              />
            )
          }
        />
        <Route
          path="/signup"
          element={
            user ? (
              <Navigate to="/movies" />
            ) : (
              <SignUpView onSignUp={(navigate) => navigate("/login")} />
            )
          }
        />
        <Route
          path="/movies"
          element={
            user ? (
              <>
                <MoviesList
                  movies={movies}
                  user={user}
                  token={token}
                  toggleFavorite={toggleFavorite}
                  favorites={favorites}
                />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/movies/:movieId"
          element={
            user ? (
              <MovieView
                onBackClick={() => setSelectedMovie(null)}
                movies={movies}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

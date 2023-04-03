import { useEffect, useState } from "react";
import { MovieCard } from "../MovieCard/movie-card";
import { MovieView } from "../MovieView/movie-view";
import movieImage from "../MainView/images/images.jpeg";
import movieImage2 from "../MainView/images/shawshank.jpg";
import movieImage3 from "../MainView/images/gladiator.jpeg";
import { LoginView } from "../LoginView/login-view";
import { SignUpView } from "../SignUpView/signup-view";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { Dropdown } from "react-bootstrap";
import styles from "./Mainview.module.css";

export const MainView = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [view, setView] = useState("login");

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
        })
        .catch((err) => console.log(err));
      console.log(selectedMovie);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      console.log("User State changed", user);
    }
  }, [user]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      setView("movies");
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    setView("login");
  };

  const onLoggedIn = (user, token) => {
    setUser(user);
    setToken(token);
    setView("movies");
  };
  const changeView = (newView) => {
    setView(newView);
  };

  if (view === "movies") {
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
      <>
        <div className={styles.container}>
          <div className={styles.accountDropdown}>
            <Dropdown>
              <Dropdown.Toggle variant="primary" id="dropdown-basic">
                Account
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <Container>
          <Row>
            {movies.map((x) => (
              <Col md={4} key={x.id}>
                <Card
                  style={{ width: "18rem", marginBottom: "1rem" }}
                  
                >
                  <Card.Img variant="top" src="" alt={x.Name} />
                  <Card.Body>
                    <Card.Title>{x.Name}</Card.Title>
                    <Button
                    variant="primary"
                    onClick={() => setSelectedMovie(x)}
                    >Open</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </>
    );
  } else if (view == "login") {
    return (
      <div>
        <LoginView onLoggedIn={onLoggedIn} changeView={changeView} />
      </div>
    );
  } else if (view === "signup") {
    return (
      <div>
        <SignUpView onSignUp={() => setView("login")} changeView={changeView} />
        <button onClick={() => setView("login")}>Back To Login</button>
      </div>
    );
  }

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

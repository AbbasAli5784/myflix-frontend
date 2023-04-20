import React from "react";
import { useState, useEffect } from "react";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export const FavoriteMovies = ({
  user,
  token,
  toggleFavorite,
  setFavorites,
  favorites,
  updateFavorites,
  onFavoritesUpdated,
  movies,
}) => {
  // useEffect(() => {
  //   if (updateFavorites) {
  //     const fetchFavoriteMovies = async () => {
  //       try {
  //         const response = await fetch(
  //           `https://morning-badlands-99587.herokuapp.com/users/${user.Username}/favoritemovies`,
  //           {
  //             headers: {
  //               Authorization: `Bearer ${token}`,
  //             },
  //           }
  //         );
  //         const data = await response.json();
  //         // const Favorite = movies.filter((x) => movies.in(x.movieId));
  //         setFavorites(data);
  //         //     const moviePromises = data.map(async (movieId) => {
  //         //       const movieResponse = await fetch(
  //         //         `https://morning-badlands-99587.herokuapp.com/movies/${movieId}`,
  //         //         {
  //         //           headers: {
  //         //             Authorization: `Bearer ${token}`,
  //         //           },
  //         //         }
  //         //       );
  //         //       return await movieResponse.json();
  //         //     });
  //         //     const movieDetails = (await Promise.all(moviePromises)).filter(
  //         //       (movie) => movie !== null
  //         //     );
  //         //     setFavorites(movieDetails);
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     };

  //     // fetchFavoriteMovies();
  //   }
  // }, [user, token, setFavorites, updateFavorites]);

  return (
    <Container>
      <Row>
        {favorites.map((movie) =>
          movie ? (
            <Col md={4} key={movie._id}>
              <Card style={{ width: "18rem", marginBottom: "1rem" }}>
                <Card.Img variant="top" src="" alt={movie.Name} />
                <Card.Body>
                  <Card.Title>{movie.Name}</Card.Title>
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(movie);
                    }}
                  >
                    {favorites.some(
                      (favMovie) => favMovie._id === movie._id
                    ) ? (
                      <FaHeart />
                    ) : (
                      <FaRegHeart />
                    )}
                  </div>
                  <Button variant="primary">Open</Button>
                </Card.Body>
              </Card>
            </Col>
          ) : null
        )}
      </Row>
    </Container>
  );
};

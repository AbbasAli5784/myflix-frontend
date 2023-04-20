import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const LoginView = ({ onLoggedIn, onNavigateToSignUp }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSignUpClick = () => {
    if (onNavigateToSignUp) {
      onNavigateToSignUp(navigate);
    } else {
      navigate("/signup");
    }
  };

  const handleSubmit = (event) => {
    // this prevents the default behavior of the form which is to reload the entire page
    event.preventDefault();

    if (!username || !password) {
      alert("Please enter correct username and password");
      return;
    }

    const data = {
      Username: username,
      Password: password,
    };

    fetch("https://morning-badlands-99587.herokuapp.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Invalid username or password");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Login succesful:", data);
        onLoggedIn(data.user, data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
      })
      .catch((error) => {
        console.error("Error during login:", error);
        alert("Invalid username or password.");
      });
  };
  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Row>
        <Col>
          <Form onSubmit={handleSubmit} className="border p-4 rounded">
            <h2 className="text-center mb-4 " as={Link} to="/movies">
              Login
            </h2>
            <Form.Group controlId="formUsername">
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formPassword" className="mt-3">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3 w-100">
              Login
            </Button>
            <Button
              variant="primary"
              className="mt-3 w-100"
              onClick={handleSignUpClick}
            >
              Sign Up
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

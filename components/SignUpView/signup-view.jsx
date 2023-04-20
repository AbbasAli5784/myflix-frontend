import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router";

export const SignUpView = ({ onSignUp, onNavigateToLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");

  const navigate = useNavigate();

  const handleSignUpSucces = () => {
    if (onSignUp) {
      onSignUp(navigate);
    } else {
      navigate("/login");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!username || !password || !email || !birthday) {
      alert("Please fill out all");
      return;
    }

    const data = {
      Username: username,
      Password: password,
      Email: email,
      Birthday: birthday,
    };
    fetch("https://morning-badlands-99587.herokuapp.com/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(
            `Server responded with ${response.status}: ${response.statusText}`
          );
        }
      })
      .then((data) => {
        console.log("User registered:", data);
        handleSignUpSucces();
      })
      .catch((error) => console.error("Error during registration:", error));
  };
  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Row>
        <Col>
          <Form onSubmit={handleSubmit} className="border p-4 rounded">
            <h2 className="text-center mb-4">Sign Up</h2>
            <Form.Group controlId="formUsername">
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Please Enter A Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formPassword" className="mt-3">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Please Enter A Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                placeholder="Please Enter A Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBirthday">
              <Form.Label>Birthday:</Form.Label>
              <Form.Control
                type="date"
                placeholder="Please Enter Birthday"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mt-3">
              Sign Up
            </Button>
            <Button
              variant="primary"
              className="w-100 mt-3"
              onClick={() => {
                if (onNavigateToLogin) {
                  onNavigateToLogin(navigate);
                } else {
                  navigate("/login");
                }
              }}
            >
              Log In
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

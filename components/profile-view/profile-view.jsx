import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Modal,
} from "react-bootstrap";

export const ProfileView = ({
  user,
  userId,
  setUser,
  currentUser,
  onProfileClick,
  onUserUpdate,
  logOut,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [newUsername, setNewUsername] = useState(currentUser.Username);
  const [newEmail, setNewEmail] = useState(currentUser.Email);
  const [newBirthday, setNewBirthday] = useState(currentUser.Birthday);
  const [showChangePasswordModal, setChangePasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [showDeleteUserModal, setDeleteUserModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const navigate = useNavigate();

  const deleteAccount = (event) => {
    event.preventDefault();

    fetch(
      `https://morning-badlands-99587.herokuapp.com/users/verifyPassword/${currentUser._id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({ password: deletePassword }),
      }
    )
      .then((response) => {
        if (response.ok) {
          return fetch(
            `https://morning-badlands-99587.herokuapp.com/users/${currentUser.Username}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${currentUser.token}`,
              },
            }
          );
        } else {
          throw new Error("Password verification failed");
        }
      })
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error("Error deleting the user");
        }
      })
      .then((data) => {
        alert("Your account has been succesfully deleted! ")
        logOut();
      })
      .catch((err) => {
        console.error("Error deleting user:", err);
      });
  };

  //Function created for allowing the user to change there password!
  const handleChangePassword = (event) => {
    event.preventDefault();
    if (oldPassword === newPassword) {
      alert("You cannot use the same password that was previously in use!");
      return;
    }

    fetch(
      `https://morning-badlands-99587.herokuapp.com/users/verifyPassword/${currentUser._id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({ password: oldPassword }),
      }
    )
      .then((response) => {
        if (response.ok) {
          return fetch(
            `https://morning-badlands-99587.herokuapp.com/users/updatePassword/${currentUser._id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${currentUser.token}`,
              },
              body: JSON.stringify({ password: newPassword }),
            }
          );
        } else {
          alert("Old password is incorrect");
          throw new Error("Old password is incorrect");
        }
      })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(
            `Server responsed with ${response.status}: ${response.statusText}`
          );
        }
      })
      .then((data) => {
        console.log("Password updated:", data);
        onProfileClick();
        logOut();
      })
      .catch((error) => {
        console.error("Error verifying password", error);
      });
  };

  const handleUpdateInfo = (event) => {
    event.preventDefault();

    const updatedUserData = {
      Username: newUsername,
      Email: newEmail,
      Birthday: newBirthday,
    };

    

    fetch(
      `https://morning-badlands-99587.herokuapp.com/users/${currentUser._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify(updatedUserData),
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(
            `Server responded with ${response.status}: ${response.statusText}`
          );
        }
      })
      .then((updatedUser) => {
        console.log("User updated:", updatedUser);
        //Update the currentUser object with the new data and close the edit form
        currentUser.Username = updatedUser.Username;
        currentUser.Email = updatedUser.Email;
        currentUser.Birthday = updatedUser.Birthday;
        currentUser._id = updatedUser._id;
        setUser(updatedUserData);
        setEditMode(false);
        if (onUserUpdate) {
          onUserUpdate(currentUser);
        }
      })
      .catch((error) => console.error("Error updating user:", error));
  };

  useEffect(() => {
    console.log("User Id:", userId);
  }, []);

  if (!currentUser) return <div>No user data available</div>;

  return (
    <Container>
      <Row>
        <Col>
          <h1>User Info</h1>
          {editMode ? (
            <Form onSubmit={handleUpdateInfo}>
              <Form.Group controlId="formUsername">
                <Form.Label>Username:</Form.Label>
                <Form.Control
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email:</Form.Label>
                <Form.Control
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formBirthday">
                <Form.Label>Birthday:</Form.Label>
                <Form.Control
                  type="date"
                  value={newBirthday}
                  onChange={(e) => setNewBirthday(e.target.value)}
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Save Changes
              </Button>
              <Button variant="secondary" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
            </Form>
          ) : (
            <>
              <div>Username: {currentUser.Username}</div>
              <div>Email: {currentUser.Email}</div>
              <div>Date Of Birth: {currentUser.Birthday}</div>
              <Button onClick={() => setEditMode(true)}>Update Info</Button>
              <Button onClick={() => setChangePasswordModal(true)}>
                Change Password
              </Button>
              <Button onClick={() => setDeleteUserModal(true)}>
                Delete Account
              </Button>
              <Modal
                show={showDeleteUserModal}
                onHide={() => setDeleteUserModal(false)}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Delete Account</Modal.Title>
                  <Modal.Body>
                    <Form onSubmit={deleteAccount}>
                      <Form.Group controlId="formUsername">
                        <Form.Label>Account Username</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Username"
                          value={currentUser.Username}
                          readOnly
                        />
                      </Form.Group>
                      <Form.Group controlId="formPasword">
                        <Form.Label>Account Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Enter Password"
                          value={deletePassword}
                          onChange={(e) => setDeletePassword(e.target.value)}
                        />
                      </Form.Group>
                      <Button variant="primary" type="submit">
                        Submit
                      </Button>
                    </Form>
                  </Modal.Body>
                </Modal.Header>
              </Modal>

              <Modal
                show={showChangePasswordModal}
                onHide={() => setChangePasswordModal(false)}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Change Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form onSubmit={handleChangePassword}>
                    <Form.Group controlId="formOldPassword">
                      <Form.Label>Old Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter Old Password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group controlId="formNewPassword">
                      <Form.Label>New Password:</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter A New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      Submit
                    </Button>
                  </Form>
                </Modal.Body>
              </Modal>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileView;

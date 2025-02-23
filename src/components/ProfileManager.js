// src/components/ProfileManager.js
import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useProfile } from "../hooks/useProfile";

function ProfileManager({ user }) {
  const { profile, loading, error, updateUserProfile } = useProfile(user.uid);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const handleEdit = () => {
    setFormData({
      displayName: profile.displayName,
      email: profile.email,
      phoneNumber: profile.phoneNumber,
      bio: profile.bio,
      notificationPreferences: {
        ...profile.notificationPreferences,
      },
    });
    setEditMode(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        notificationPreferences: {
          ...prev.notificationPreferences,
          [name]: checked,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      await updateUserProfile(formData);
      setEditMode(false);
      setUpdateSuccess(true);
    } catch (err) {
      setUpdateError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h3 className="mb-0">Profile Settings</h3>
              {!editMode && (
                <Button variant="primary" onClick={handleEdit}>
                  Edit Profile
                </Button>
              )}
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {updateError && <Alert variant="danger">{updateError}</Alert>}
              {updateSuccess && (
                <Alert variant="success">Profile updated successfully!</Alert>
              )}

              {editMode ? (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Display Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={3}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Notification Preferences</Form.Label>
                    <div>
                      <Form.Check
                        type="checkbox"
                        name="email"
                        label="Email Notifications"
                        checked={formData.notificationPreferences?.email}
                        onChange={handleChange}
                      />
                      <Form.Check
                        type="checkbox"
                        name="push"
                        label="Push Notifications"
                        checked={formData.notificationPreferences?.push}
                        onChange={handleChange}
                      />
                    </div>
                  </Form.Group>

                  <div className="d-flex gap-2">
                    <Button type="submit" variant="success">
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setEditMode(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              ) : (
                <div>
                  <p>
                    <strong>Display Name:</strong> {profile.displayName}
                  </p>
                  <p>
                    <strong>Email:</strong> {profile.email}
                  </p>
                  <p>
                    <strong>Phone Number:</strong>{" "}
                    {profile.phoneNumber || "Not set"}
                  </p>
                  <p>
                    <strong>Bio:</strong> {profile.bio || "No bio provided"}
                  </p>
                  <p>
                    <strong>Timezone:</strong> {profile.timezone}
                  </p>
                  <p>
                    <strong>Notification Preferences:</strong>
                  </p>
                  <ul>
                    <li>
                      Email:{" "}
                      {profile.notificationPreferences?.email
                        ? "Enabled"
                        : "Disabled"}
                    </li>
                    <li>
                      Push:{" "}
                      {profile.notificationPreferences?.push
                        ? "Enabled"
                        : "Disabled"}
                    </li>
                  </ul>
                  <p>
                    <strong>Last Updated:</strong>{" "}
                    {profile.lastUpdated?.toDate().toLocaleDateString()}
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ProfileManager;

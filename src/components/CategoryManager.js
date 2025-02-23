// src/components/CategoryManager.js
import React, { useState } from "react";
import { Form, Button, ListGroup, Alert, Spinner } from "react-bootstrap";
import { useFirestore } from "../hooks/useFirestore";

function CategoryManager({ userId }) {
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");

  // Use our custom hook for categories
  const {
    data: categories,
    loading,
    error: firestoreError,
    addItem: addCategory,
    deleteItem: deleteCategory,
  } = useFirestore("categories", userId);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      await addCategory({
        name: newCategory,
      });
      setNewCategory("");
    } catch (err) {
      setError("Error adding category: " + err.message);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
    } catch (err) {
      setError("Error deleting category: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-3">
        <Spinner animation="border" size="sm" />
      </div>
    );
  }

  return (
    <div className="mb-4">
      <h4>Manage Categories</h4>
      {(error || firestoreError) && (
        <Alert variant="danger">{error || firestoreError}</Alert>
      )}

      <Form onSubmit={handleAddCategory} className="mb-3">
        <Form.Group className="d-flex">
          <Form.Control
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter new category"
            className="me-2"
          />
          <Button type="submit" variant="secondary">
            Add Category
          </Button>
        </Form.Group>
      </Form>

      <ListGroup>
        {categories && categories.length > 0 ? (
          categories.map((category) => (
            <ListGroup.Item
              key={category.id}
              className="d-flex justify-content-between align-items-center"
            >
              {category.name}
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => handleDeleteCategory(category.id)}
              >
                Delete
              </Button>
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item className="text-center text-muted">
            No categories yet. Add your first category above.
          </ListGroup.Item>
        )}
      </ListGroup>
    </div>
  );
}

export default CategoryManager;

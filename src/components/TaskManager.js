// src/components/TaskManager.js
import React, { useState, useMemo } from "react";
import { auth } from "../firebase";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  ListGroup,
  Alert,
  Badge,
  Spinner,
} from "react-bootstrap";
import CategoryManager from "./CategoryManager";
import { useFirestore } from "../hooks/useFirestore";

function TaskManager({ user }) {
  const [newTask, setNewTask] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [error, setError] = useState("");

  // Using our custom hook for both tasks and categories
  const {
    data: tasks,
    loading: tasksLoading,
    error: tasksError,
    addItem: addTask,
    deleteItem: deleteTask,
    updateItem: updateTask,
  } = useFirestore("tasks", user.uid);

  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useFirestore("categories", user.uid);

  // Memoized filtered tasks to prevent unnecessary recalculations
  const filteredTasks = useMemo(() => {
    return filterCategory
      ? tasks.filter((task) => task.categoryId === filterCategory)
      : tasks;
  }, [tasks, filterCategory]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      await addTask({
        title: newTask,
        completed: false,
        categoryId: selectedCategory || null,
      });
      setNewTask("");
    } catch (err) {
      setError("Error adding task: " + err.message);
    }
  };

  const handleToggleComplete = async (taskId, currentStatus) => {
    try {
      await updateTask(taskId, { completed: !currentStatus });
    } catch (err) {
      setError("Error updating task: " + err.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
    } catch (err) {
      setError("Error deleting task: " + err.message);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  if (tasksLoading || categoriesLoading) {
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
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Task Manager</h1>
            <Button variant="outline-danger" onClick={() => auth.signOut()}>
              Logout
            </Button>
          </div>

          {(error || tasksError || categoriesError) && (
            <Alert variant="danger">
              {error || tasksError || categoriesError}
            </Alert>
          )}

          <CategoryManager userId={user.uid} />

          <Form onSubmit={handleAddTask} className="mb-4">
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter a new task"
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Form.Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-50"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>

              <Button type="submit" variant="primary">
                Add Task
              </Button>
            </div>
          </Form>

          <div className="mb-4">
            <Form.Select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
          </div>

          <ListGroup>
            {filteredTasks.map((task) => (
              <ListGroup.Item
                key={task.id}
                className="d-flex justify-content-between align-items-center"
              >
                <div className="d-flex align-items-center">
                  <Form.Check
                    type="checkbox"
                    checked={task.completed}
                    onChange={() =>
                      handleToggleComplete(task.id, task.completed)
                    }
                    className="me-3"
                  />
                  <div>
                    <span
                      style={{
                        textDecoration: task.completed
                          ? "line-through"
                          : "none",
                      }}
                    >
                      {task.title}
                    </span>
                    <Badge bg="secondary" className="ms-2">
                      {getCategoryName(task.categoryId)}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  Delete
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}

export default TaskManager;

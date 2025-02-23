// src/App.js
import React, { useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import Auth from "./components/Auth";
import TaskManager from "./components/TaskManager";
import ProfileManager from "./components/ProfileManager";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";

// Navigation component to be used across authenticated pages
const Navigation = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Task Manager
        </Link>
        <div className="navbar-nav">
          <Link className="nav-link" to="/profile">
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
};

// Layout component to wrap authenticated content
const AuthenticatedLayout = ({ user, children }) => {
  return (
    <div>
      <Navigation />
      {children}
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up authentication state observer
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  // If user is not authenticated, show Auth component
  if (!user) {
    return <Auth setUser={setUser} />;
  }

  // If user is authenticated, show the router with protected routes
  return (
    <Router>
      <AuthenticatedLayout user={user}>
        <Routes>
          <Route path="/" element={<TaskManager user={user} />} />
          <Route path="/profile" element={<ProfileManager user={user} />} />
          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthenticatedLayout>
    </Router>
  );
}

export default App;

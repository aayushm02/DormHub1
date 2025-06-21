import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import ReviewsPage from './components/ReviewPage';
import Dorms from './components/Dorms';
import Marketplace from './components/Marketplace';
import Chat from './components/Chat';

const App = () => {
  const [dorms, setDorms] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/dorms')
      .then(res => setDorms(res.data))
      .catch(err => console.error('Error fetching dorms:', err));
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <div className="container mx-auto p-4">
                <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">Welcome to DormHub</h1>
                <ReviewsPage />
              </div>
            }
          />
          <Route path="/dorms" element={<Dorms dorms={dorms} setDorms={setDorms} />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/reviews" element={<ReviewsPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
import React, { useState } from 'react';
import axios from 'axios';

const Dorms = ({ dorms, setDorms }) => {
  const [newDorm, setNewDorm] = useState({ name: '', description: '' });
  const [rating, setRating] = useState({ dormId: '', score: 1, comment: '' });

  const addDorm = () => {
    if (!newDorm.name || !newDorm.description) {
      alert('Please fill in both name and description');
      return;
    }
    axios.post('http://localhost:5000/api/dorms', newDorm)
      .then(res => {
        setDorms([...dorms, res.data]);
        setNewDorm({ name: '', description: '' });
      })
      .catch(err => console.error('Error adding dorm:', err));
  };

  const submitRating = (dormId) => {
    if (!rating.comment) {
      alert('Please add a comment for the rating');
      return;
    }
    axios.post('http://localhost:5000/api/ratings', { ...rating, dormId })
      .then(res => {
        setDorms(dorms.map(dorm =>
          dorm._id === dormId ? { ...dorm, ratings: [...dorm.ratings, res.data] } : dorm
        ));
        setRating({ dormId: '', score: 1, comment: '' });
      })
      .catch(err => console.error('Error submitting rating:', err));
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Dorm Listings</h2>
      {/* Add Dorm Form */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">Add New Dorm</h3>
        <input
          type="text"
          placeholder="Dorm Name"
          value={newDorm.name}
          onChange={e => setNewDorm({ ...newDorm, name: e.target.value })}
          className="border p-2 mr-2 rounded w-full mb-2"
        />
        <textarea
          placeholder="Description"
          value={newDorm.description}
          onChange={e => setNewDorm({ ...newDorm, description: e.target.value })}
          className="border p-2 mr-2 rounded w-full mb-2"
        />
        <button
          onClick={addDorm}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Dorm
        </button>
      </div>
      {/* Dorm List */}
      <div>
        {dorms.length === 0 && <p>No dorms available. Add one above!</p>}
        {dorms.map(dorm => (
          <div key={dorm._id} className="border p-4 mb-4 rounded-lg shadow-md bg-white">
            <h3 className="text-xl font-bold">{dorm.name}</h3>
            <p>{dorm.description}</p>
            <p className="text-blue-600">
              Average Rating: {dorm.ratings.length > 0
                ? (dorm.ratings.reduce((sum, r) => sum + r.score, 0) / dorm.ratings.length).toFixed(1)
                : 'No ratings yet'}
            </p>
            <div>
              <h4 className="font-semibold">Rate this dorm:</h4>
              <select
                value={rating.score}
                onChange={e => setRating({ ...rating, score: parseInt(e.target.value), dormId: dorm._id })}
                className="border p-2 mr-2 rounded"
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Comment"
                value={rating.dormId === dorm._id ? rating.comment : ''}
                onChange={e => setRating({ ...rating, comment: e.target.value, dormId: dorm._id })}
                className="border p-2 mr-2 rounded"
              />
              <button
                onClick={() => submitRating(dorm._id)}
                className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
              >
                Submit Rating
              </button>
            </div>
            <div>
              <h4 className="font-semibold mt-2">Ratings:</h4>
              {dorm.ratings.map((r, idx) => (
                <p key={idx}>{r.score}/5 - {r.comment}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dorms;
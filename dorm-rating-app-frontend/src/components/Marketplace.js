import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Marketplace = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ title: '', description: '', type: 'rent', price: '' });

  useEffect(() => {
    axios.get('http://localhost:5000/api/items')
      .then(res => setItems(res.data))
      .catch(err => console.error('Error fetching items:', err));
  }, []);

  const addItem = () => {
    if (!newItem.title || !newItem.description || !newItem.price) {
      alert('Please fill in all fields');
      return;
    }
    axios.post('http://localhost:5000/api/items', newItem)
      .then(res => {
        setItems([...items, res.data]);
        setNewItem({ title: '', description: '', type: 'rent', price: '' });
      })
      .catch(err => console.error('Error adding item:', err));
  };

  const inquire = (item) => {
    alert(`Inquiry sent for ${item.title}! (Contact via chat using your socket ID.)`);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Rent or Buy Items</h2>
      {/* Add Item Form */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">List an Item</h3>
        <input
          type="text"
          placeholder="Item Title"
          value={newItem.title}
          onChange={e => setNewItem({ ...newItem, title: e.target.value })}
          className="border p-2 mr-2 rounded w-full mb-2"
        />
        <textarea
          placeholder="Description"
          value={newItem.description}
          onChange={e => setNewItem({ ...newItem, description: e.target.value })}
          className="border p-2 mr-2 rounded w-full mb-2"
        />
        <select
          value={newItem.type}
          onChange={e => setNewItem({ ...newItem, type: e.target.value })}
          className="border p-2 mr-2 rounded mb-2"
        >
          <option value="rent">Rent</option>
          <option value="sale">Sale</option>
        </select>
        <input
          type="number"
          placeholder="Price ($)"
          value={newItem.price}
          onChange={e => setNewItem({ ...newItem, price: e.target.value })}
          className="border p-2 mr-2 rounded w-full mb-2"
        />
        <button
          onClick={addItem}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          List Item
        </button>
      </div>
      {/* Item List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length === 0 && <p>No items available. List one above!</p>}
        {items.map(item => (
          <div key={item._id} className="border p-4 rounded-lg shadow-md bg-white">
            <h3 className="text-lg font-bold">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
            <p className="text-blue-600 font-semibold">
              {item.type === 'rent' ? `Rent: $${item.price}/month` : `Buy: $${item.price}`}
            </p>
            <button
              onClick={() => inquire(item)}
              className="mt-2 bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Inquire
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css"; 
const API_URL = "http://localhost:5000/items"; 
function App() {
  const[items,setItems]= useState([]);
  const[newItem,setNewItem]= useState({ name: "", price: "", description: "" });
  const[editId,setEditId]= useState(null);
  const[editData,setEditData]= useState({ name: "", price: "", description: "" });

  useEffect(() => {
    fetchItems();
  }, []);
  const fetchItems = async () => {
    try {
      const response = await axios.get(API_URL);
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };
  const handleAdd = async () => {
    if (!newItem.name || !newItem.price) return;
    try {
      const response = await axios.post(API_URL, newItem);
      setItems([...items, response.data]);
      setNewItem({ name: "", price: "", description: "" });
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };
  const handleEdit = (item) => {
    setEditId(item._id);
    setEditData({ name: item.name, price: item.price, description: item.description });
  };
  const handleUpdate = async () => {
    if (!editData.name || !editData.price) return;
    try {
      const response = await axios.put(`${API_URL}/${editId}`, editData);
      setItems(items.map(item => (item._id === editId ? response.data : item)));
      setEditId(null);
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setItems(items.filter(item => item._id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };
  return (
    <div className="container">
      <h1>CRUD Operations</h1>
      {/* Add New Item Form */}
      <div className="form-group">
        <input
          type="text"
          placeholder="Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newItem.description}
          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
        />
        <button onClick={handleAdd}>Add Item</button>
      </div>
      {/* Items List */}
      <ul className="items-list">
        {items.map((item) => (
          <li key={item._id} className="item">
            {editId === item._id ? (
              <div className="edit-group">
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                />
                <input
                  type="number"
                  value={editData.price}
                  onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                />
                <input
                  type="text"
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                />
                <button onClick={handleUpdate} className="save-btn">Save</button>
              </div>
            ) : (
              <div className="item-details">
                <p><strong>{item.name}</strong></p>
                <p>${item.price}</p>
                <p>{item.description}</p>
              </div>
            )}
            <div className="buttons">
              {editId === item._id ? null : (
                <>
                  <button onClick={() => handleEdit(item)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(item._id)} className="delete-btn">Delete</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default App;

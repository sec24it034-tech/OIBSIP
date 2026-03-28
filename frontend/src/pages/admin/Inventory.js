import React, { useEffect, useState } from 'react';
import { getAllIngredients, addIngredient, updateIngredient, deleteIngredient, updateIngredientStock } from '../../api';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaExclamationTriangle } from 'react-icons/fa';

const Inventory = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'base',
    price: 0,
    stock: 100,
    unit: 'pcs',
    lowStockThreshold: 20,
    description: '',
  });

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const response = await getAllIngredients();
      setIngredients(response.data.data);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateIngredient(editingItem._id, formData);
        toast.success('Ingredient updated successfully!');
      } else {
        await addIngredient(formData);
        toast.success('Ingredient added successfully!');
      }
      setShowAddModal(false);
      setEditingItem(null);
      resetForm();
      fetchIngredients();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (ingredient) => {
    setEditingItem(ingredient);
    setFormData({
      name: ingredient.name,
      category: ingredient.category,
      price: ingredient.price,
      stock: ingredient.stock,
      unit: ingredient.unit,
      lowStockThreshold: ingredient.lowStockThreshold,
      description: ingredient.description || '',
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this ingredient?')) {
      try {
        await deleteIngredient(id);
        toast.success('Ingredient deleted successfully!');
        fetchIngredients();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete');
      }
    }
  };

  const handleStockUpdate = async (id, newStock) => {
    try {
      await updateIngredientStock(id, newStock);
      toast.success('Stock updated successfully!');
      fetchIngredients();
    } catch (error) {
      toast.error('Failed to update stock');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'base',
      price: 0,
      stock: 100,
      unit: 'pcs',
      lowStockThreshold: 20,
      description: '',
    });
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'base': return '#1565c0';
      case 'sauce': return '#c2185b';
      case 'cheese': return '#f57c00';
      case 'topping': return '#2e7d32';
      default: return '#666';
    }
  };

  const groupedIngredients = ingredients.reduce((acc, ingredient) => {
    if (!acc[ingredient.category]) {
      acc[ingredient.category] = [];
    }
    acc[ingredient.category].push(ingredient);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-inventory">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Inventory Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => { resetForm(); setEditingItem(null); setShowAddModal(true); }}
        >
          <FaPlus style={{ marginRight: '8px' }} />
          Add Ingredient
        </button>
      </div>

      {/* Low Stock Alert */}
      {ingredients.filter(i => i.stock <= i.lowStockThreshold).length > 0 && (
        <div className="alert alert-warning mb-3">
          <FaExclamationTriangle style={{ marginRight: '8px' }} />
          <strong>Low Stock Alert:</strong> {ingredients.filter(i => i.stock <= i.lowStockThreshold).length} items are running low on stock!
        </div>
      )}

      {/* Category-wise display */}
      {Object.keys(groupedIngredients).map(category => (
        <div key={category} className="card mb-3">
          <h3 style={{ color: getCategoryColor(category), textTransform: 'capitalize' }}>
            {category}s
          </h3>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Threshold</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {groupedIngredients[category].map(ingredient => (
                <tr key={ingredient._id}>
                  <td>{ingredient.name}</td>
                  <td>₹{ingredient.price}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="number"
                        value={ingredient.stock}
                        onChange={(e) => handleStockUpdate(ingredient._id, parseInt(e.target.value))}
                        style={{ width: '70px', padding: '0.25rem' }}
                        min="0"
                      />
                      <span>{ingredient.unit}</span>
                    </div>
                  </td>
                  <td>{ingredient.lowStockThreshold} {ingredient.unit}</td>
                  <td>
                    {ingredient.stock <= ingredient.lowStockThreshold ? (
                      <span style={{ color: '#dc3545', fontWeight: 'bold' }}>Low Stock</span>
                    ) : (
                      <span style={{ color: '#28a745' }}>In Stock</span>
                    )}
                  </td>
                  <td>
                    <button 
                      className="btn"
                      style={{ marginRight: '0.5rem' }}
                      onClick={() => handleEdit(ingredient)}
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="btn"
                      style={{ color: '#dc3545' }}
                      onClick={() => handleDelete(ingredient._id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingItem ? 'Edit Ingredient' : 'Add New Ingredient'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="base">Base</option>
                  <option value="sauce">Sauce</option>
                  <option value="cheese">Cheese</option>
                  <option value="topping">Topping</option>
                </select>
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="form-control"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Initial Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="form-control"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label>Unit</label>
                  <input
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="e.g., pcs, kg"
                  />
                </div>

                <div className="form-group">
                  <label>Low Stock Threshold</label>
                  <input
                    type="number"
                    name="lowStockThreshold"
                    value={formData.lowStockThreshold}
                    onChange={handleInputChange}
                    className="form-control"
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-control"
                  rows="2"
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={() => { setShowAddModal(false); setEditingItem(null); }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Update' : 'Add'} Ingredient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext.jsx";
import { useNavigate, Navigate } from "react-router-dom";

const Admin = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", quantity: 0, price: 0 });
  const [search, setSearch] = useState("");
  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "admin") {
        navigate("/login");
      } else {
        fetchProducts();
      }
    }
  }, [user, loading, navigate]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  const handleAdd = async () => {
    try {
      const role=user?.role || "user";
      const res = await fetch("http://localhost:5000/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" ,role:role},
        body: JSON.stringify(form),
      });

      if (res.ok) {
        fetchProducts();
        setForm({ name: "", quantity: 0, price: 0 });
      } else {
        const data = await res.json();
        alert(data.message);
      }
    } catch (err) {
      console.error("Failed to add product:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const role = user?.role || "user";
      const res = await fetch(`http://localhost:5000/products/${id}`, {
        method: "DELETE",
        headers:{role:role}
      });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  const handleSell = async (id) => {
    const qty = prompt("Enter quantity to sell:");
    if (!qty) return;

    try {
      const role = user?.role || "user";
      const res = await fetch(`http://localhost:5000/products/${id}/sell`, {
        method: "POST",
        headers: { "Content-Type": "application/json" ,role:role},
        body: JSON.stringify({ quantityToSell: Number(qty) }),
      });

      const data = await res.json();
      if (res.ok) fetchProducts();
      else alert(data.message);
    } catch (err) {
      console.error("Failed to sell product:", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) return <p>Loading...</p>;
  if (!user || user.role !== "admin") return <Navigate to="/login" />;
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h2>Admin Panel</h2>
      <h3>Add Product</h3>
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Quantity"
        value={form.quantity}
        onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
      />
      <input
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
      />
      <button onClick={handleAdd}>Add Product</button>
      <h3>Products</h3>
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "1rem", padding: "5px" }}
      />
      <table style={{ marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.quantity}</td>
              <td>₹{p.price}</td>
              <td>{p.status}</td>
              <td>
                <button onClick={() => handleSell(p._id)}>Sell</button>
                <button onClick={() => handleDelete(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="logout-center">
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Admin;

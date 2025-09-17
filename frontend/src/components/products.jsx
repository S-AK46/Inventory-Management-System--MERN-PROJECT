import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext.jsx";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
    else if (user) {
      fetch("http://localhost:5000/products")
        .then((res) => res.json())
        .then((data) => setProducts(data));
    }
  }, [user, loading, navigate]);

  if (loading || !user) return <p>Loading...</p>;

  return (
    <div className="products-container">
      <h2>Products</h2>
      <table className="products-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.quantity}</td>
              <td>₹{p.price}</td>
              <td>{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="logout-center">
        <button
          className="logout-btn"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Products;

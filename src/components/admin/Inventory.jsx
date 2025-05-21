import React, { useState, useEffect } from "react";
import axios from "axios";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://fakestoreapi.com/products");
      const productsWithStock = response.data
        .filter(
          (product) =>
            product.category === "women's clothing" ||
            product.category === "jewelery"
        )
        .map((product) => ({
          ...product,
          stock: Math.floor(Math.random() * 100),
          lowStockThreshold: 10,
        }));
      setProducts(productsWithStock);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const updateStock = async (productId, newStock) => {
    try {
      setProducts(
        products.map((product) =>
          product.id === productId ? { ...product, stock: newStock } : product
        )
      );
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "all" ||
        product.category === selectedCategory ||
        (selectedCategory === "women's clothing" &&
          product.category === "women's clothing") ||
        (selectedCategory === "jewelery" && product.category === "jewelery"))
  );

  if (loading) {
    return (
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">Loading...</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-sm-6">
            <h1 className="m-0">Inventory Management</h1>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="input-group" style={{ width: "300px" }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select
                    className="form-control"
                    style={{ width: "200px" }}
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="women's clothing">Women's Clothing</option>
                    <option value="jewelery">Jewelery</option>
                  </select>
                </div>
              </div>

              <div className="card-body table-responsive p-0">
                <table className="table table-hover text-nowrap">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.title}</td>
                        <td>{product.category}</td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            style={{ width: "100px" }}
                            value={product.stock}
                            onChange={(e) =>
                              updateStock(product.id, parseInt(e.target.value))
                            }
                            min="0"
                          />
                        </td>
                        <td>
                          {product.stock <= product.lowStockThreshold ? (
                            <span className="badge bg-danger">Low Stock</span>
                          ) : (
                            <span className="badge bg-success">In Stock</span>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn btn-info btn-sm mr-2"
                            onClick={() => {
                              /* Tu będzie historia zmian */
                            }}
                          >
                            History
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;

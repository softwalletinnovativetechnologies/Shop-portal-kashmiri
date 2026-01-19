import { useEffect, useState } from "react";
import "./adminProducts.css";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5001/api/admin/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.keys(form).forEach((key) => fd.append(key, form[key]));
    fd.append("image", image);

    const res = await fetch("http://localhost:5001/api/admin/products", {
      method: "POST",
      body: fd,
    });

    const newProduct = await res.json();
    setProducts([newProduct, ...products]);
  };

  const remove = async (id) => {
    await fetch(`http://localhost:5001/api/admin/products/${id}`, {
      method: "DELETE",
    });
    setProducts(products.filter((p) => p._id !== id));
  };

  return (
    <div className="admin-products">
      <h1>Products</h1>

      {/* ADD PRODUCT */}
      <form className="product-form" onSubmit={submit}>
        <input
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Price"
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          placeholder="Stock"
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />
        <input
          placeholder="Category"
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <textarea
          placeholder="Description"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button>Add Product</button>
      </form>

      {/* PRODUCT GRID */}
      <div className="grid">
        {products.map((p) => (
          <div className="card" key={p._id}>
            <img src={`http://localhost:5001${p.image}`} />
            <h3>{p.name}</h3>
            <p>₹{p.price}</p>
            <button className="delete" onClick={() => remove(p._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

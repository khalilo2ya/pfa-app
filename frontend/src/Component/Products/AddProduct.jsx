import React, { useState } from 'react';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    oldprice: '',
    newPrice: ''
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please select an image");

    const data = new FormData();
    data.append("image", image);
    data.append("name", formData.name);
    data.append("category", formData.category);
    data.append("oldprice", formData.oldprice);
    data.append("newPrice", formData.newPrice);

    try {
      const res = await fetch("http://localhost:4000/addProduct", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (result.success) {
        alert(`Product "${result.name}" added successfully!`);
        setFormData({ name: '', category: '', oldprice: '', newPrice: '' });
        setImage(null);
        setPreview(null);
      } else {
        alert("Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add product.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Product</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-5">
        <div>
          <label className="block font-medium mb-1">Product Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Category</label>
          <input
            type="text"
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Old Price</label>
          <input
            type="number"
            name="oldprice"
            required
            value={formData.oldprice}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">New Price</label>
          <input
            type="number"
            name="newPrice"
            required
            value={formData.newPrice}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
          {preview && <img src={preview} alt="Preview" className="mt-3 w-40 h-40 object-cover rounded-lg border" />}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;

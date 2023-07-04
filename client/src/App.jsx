// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

let Backend_URL = "http://localhost:3001";

const App = () => {
  const [customer, setCustomer] = useState("Guset")
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [price, setPrice] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cart ,setCart] = useState({});
  const [bill,setBill] = useState(null)

  // Fetch all products
  
  useEffect(() => {
    axios.get(`${Backend_URL}/products`)
      .then(response => {
        setProducts(response.data.data);
        console.log(response.data.data)
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  // Fetch bill
  const getBill = (e) => {
    e.preventDefault();
    axios.get(`${Backend_URL}/${customer}/bill`,{ params: {...cart} })
      .then(response => {
        // Process the bill data as required
        setBill(response.data)
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
        alert(error.message)
      });
  };

  // Create a new product
  // const createProduct = () => {
    
  //   const productData = {
  //     name: name,
  //     category: category,
  //     subcategory: subcategory,
  //     price: price,
  //   };

  //   axios.post('/api/products', productData)
  //     .then(response => {
  //       const newProduct = response.data.data;
  //       setProducts([...products, newProduct]);
  //       // Clear form fields
  //       setName('');
  //       setCategory('');
  //       setSubcategory('');
  //       setPrice(0);
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // };

  // // Update a product (Admin only)
  // const updateProduct = (productId) => {
  //   const productData = {
  //     name: name,
  //     category: category,
  //     subcategory: subcategory,
  //     price: price,
  //   };

  //   axios.put(`/api/products/${productId}`, productData)
  //     .then(response => {
  //       const updatedProduct = response.data.data;
  //       const updatedProducts = products.map(product => {
  //         if (product._id === productId) {
  //           return updatedProduct;
  //         }
  //         return product;
  //       });
  //       setProducts(updatedProducts);
  //       // Clear form fields
  //       setName('');
  //       setCategory('');
  //       setSubcategory('');
  //       setPrice(0);
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // };

  // Function to check if the user is an admin (Dummy implementation)
  // const checkAdminStatus = () => {
  //   const isAdminUser = true; // Replace with actual logic to check if user is an admin
  //   setIsAdmin(isAdminUser);
  // };

  // useEffect(() => {
  //   checkAdminStatus();
  // }, []);

  function handle(e) {
    const item = { ...cart };
    item[e.target.id] = e.target.value;
    setCart(item);
    console.log(item);
  }

  return (
    <div>
      <h1>Product Management</h1>
      {/* <div>
        <h2>Add New Product</h2>
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input type="text" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
        <input type="text" placeholder="Subcategory" value={subcategory} onChange={e => setSubcategory(e.target.value)} />
        <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
        <button onClick={createProduct}>Add Product</button>
      </div> */}
      <div>
        <h2>Product List</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Subcategory</th>
              <th>Price</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.subcategory}</td>
                <td>{product.price}</td>
                {isAdmin && (
                  <td>
                    <button onClick={() => updateProduct(product._id)}>Edit</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        { products.map(each=>(
          <div key={each._id} className="card">
            <h4>{each.name}</h4>
            <p>Rs {each.price}/{each.unit}</p>
            {each.discount && 
            <p>Offer: {each.discount.type=="percentage" ?
              <p>{each.discount.value}% off</p> :
              <p>buy {each.discount.buy}{each.unit} get {each.discount.get}{each.unit}</p> }
            </p>}
            <input onChange={(e) => handle(e)} type='number' id = {each.name} value={cart.name} />
           </div>
        ))
        }
      </div>
      <div>
        <h2>Bill</h2>
        <p>Enter your name</p>
        <input type='text' value={customer} onChange={e => setCustomer(e.target.value)} />
        { bill && <pre>{bill}</pre> }
        <button onClick={(e)=>getBill(e)}>Generate Bill</button>
      </div>
    </div>
  );
};

export default App;

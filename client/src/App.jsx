// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./App.css"

let Backend_URL =  'https://super-market-sable.vercel.app'
          //"http://localhost:3001";

const App = () => {
  const [customer, setCustomer] = useState("Guset")
  const [products, setProducts] = useState([]);
  // const [name, setName] = useState('');
  // const [catagories, setCatagories] = useState([]);
  // const [subcatagories, setSubcatagories] = useState([]);
  // const [price, setPrice] = useState(0);
  // const [isAdmin, setIsAdmin] = useState(false);
  const [cart ,setCart] = useState({});
  const [bill,setBill] = useState(null)

  // Fetch all products
  
  useEffect(() => {
    axios.get(`${Backend_URL}/products`)
      .then(response => {
        setProducts(response.data.data);
        // setCatagories([...new Set(products.map((e)=>e.catagory))])
        // setSubcatagories([...new Set(products.map((e)=>e.subcatagory))])
        console.log(response.data.data)
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  // console.log("catagory=>",catagories)
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
    if (e.target.value > 0) {
      item[e.target.id] = +e.target.value;      
    }else{
      delete item[e.target.id]
      if(!Object.keys(item).length){
        setBill(null)
      }
    }
    setCart(item);
    console.log(item);
  }

  return (
    <div>
      <h1>Super Market</h1>
      {/* <div>
        <h2>Add New Product</h2>
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input type="text" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
        <input type="text" placeholder="Subcategory" value={subcategory} onChange={e => setSubcategory(e.target.value)} />
        <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
        <button onClick={createProduct}>Add Product</button>
      </div> */}
      {/* {catagories.map()} */}

      <div className='product-list' >
        <h2>Product List</h2>
        {/* <table>
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
        </table> */}
        <div className="cards">
        { products.map(each=>(
          <div key={each._id} className={cart[each.name]?"card added":"card"}>
            <h4>{each.name}</h4>
            <div>
              <span>{each.discountOnCatagory.value}% off in {each.catagory} </span><br/>
              <span>{each.discountOnSubcatagory.value}% off in {each.subcatagory} </span>
            </div>
            <span className='price' >Rs {each.price}/{each.unit}</span>
            {each.discount && 
            each.discount.type=="percentage" ?
              <p>Offer {each.discount.value}% off</p> :
              <p>Offer buy {each.discount.buy}{each.unit} get {each.discount.get}{each.unit}</p> 
            }
            <div className="input">
              <input onChange={(e) => handle(e)} type='number' id = {each.name} value={cart.name} />{each.unit}
            </div>
           </div>
        ))
        }</div>
      </div>
      <div>
        <h2>Bill</h2>
        
        { bill ? <pre>{bill}</pre> : <div><p>Enter your name</p><input type='text' value={customer} onChange={e => setCustomer(e.target.value)} /></div> }
        <button className='generate' onClick={(e)=>getBill(e)}>Generate Bill</button>
      </div>
    </div>
  );
};

export default App;

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import rect_icon from '../../asssets/rect_icon.png'
import './Products.css'

const Products = () => {
    const [allproducts,setAllproducts] = useState([])
    const [cartItems, setCartItems] = useState([]);

      const fetchNewCollection = async () => {
          try {
              const res =await fetch('http://localhost:4000/NewCollections');
              const data = await res.json();
              setAllproducts(data);
          } catch (error) {
              console.error('Error fetching products : ' , error)
              
          }
      };
      useEffect(() =>{
        fetchNewCollection();
      } , [])
      const addTocart = (itemId) => {
        const user = JSON.parse(localStorage.getItem('user'));
        setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 })); 
        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/Addtocart', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId: itemId , user:user})
 
            })
                .then((response) => response.json())
                .then((data) => console.log(data))
                .catch((error) => console.error('Error adding to cart:', error));
            
        } else {
            console.error('User is not authenticated');
        }
    };
  return (
    <div className='Products'>
         <div className="title1">
                    <img src={rect_icon} alt="" width={"18px"} height={"45px"} />
                    <span>Our Products</span>
                </div>
                <div className="title2">
                    <span>Explore Our Products</span>
                    
                </div>
                <div className="Products_item">
                {
                  allproducts.map((product,index) =>(
                      <div key={index} className='product-card'>
                          <img src={product.image} alt="" className='prod_img' />
                          <p className='prod_name'>{product.name}</p>
                          <div className="price">
                          <p className='product_new_price'> $ {product.newPrice} </p> 
                          <p className='product_old_price'> $ {product.oldprice} </p>
                          
                          </div>
                         <div className="add_cart_favorite">
                            <div className="add_cart">
                                <button className="Add_to_cart"  onClick={() => addTocart(product.id)}>Add to cart 
                                    <i className="bi bi_cart">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart" viewBox="0 0 16 16">
  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
</svg>
                                    </i>
                                </button>
                            </div>
                            <div className="favorite">
                                <i className="bi bi_heart">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
  <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
</svg>
                                </i>
                            </div>
                         </div>
                      </div>
                  ))
              }
                </div>
                <Link to={'/Collections'}>
                <button className='viewAllBtn'>View All</button>
                </Link>
    </div>
  )
}

export default Products

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/cart.css';

const Cart = () => {
  const[cartItems,setCartItems] = useState([]);
  useEffect(()=>{
    const fetchCart = async () =>{
      const token = localStorage.getItem('auth-token');
      try {
        const response = await fetch('http://localhost:4000/getCart',{
          method:'Get',
          headers:{
            'Content-Type':'application/json',
            'auth-token':token,
          },
        });
        const data = await response.json();
        if(data.success)
        {
          setCartItems(Array.isArray(data.cart) ? data.cart : []);
        }
      } catch (error) {
        console.error('Error fetching cart:',error);
      }
    };
    fetchCart();
  },[]);
  const removeFromCart = async(itemId) =>{
    const  user = JSON.parse(localStorage.getItem('user'));
    setCartItems((prev)=>prev.filter(item => item.id !== itemId));
    if (localStorage.getItem('auth-token')) {
      fetch('http://localhost:4000/RemoveFromCart',{
        method:'POST',
        headers:{
          Accept:'application/json',
          'auth-token':`${localStorage.getItem('auth-token')}`,
          'Content-Type':'application/json',
        },
        body:JSON.stringify({itemId: itemId,  user:user}),
        
      })
      .then((response)=>response.json())
      .then((data)=>console.log(data))
      .catch((error)=>console.error('Error removing from cart',error))
    }else{
      alert("please authenticate first , so you can add your items to your cart ")
    }
    
  };
 
  return (
  
    
    <div className='carts'>
      <div className="head">
        <div style={{ marginLeft: "35%" }}>Products</div>
        <div>Price</div>
        <div>Quantity</div>
        <div>Subtotal</div>
       
      </div>
      {
        cartItems.length === 0 ? (
          <p style={{marginTop:"5%"}}>Your cart is empty</p>
        ):(
          cartItems.map((item)=>(
            <div className="cart_info" key={item.id}>
              <div className="product_img_cross_icon">
                <i className="bi bi-x" onClick={() => removeFromCart(item.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-x" viewBox="0 0 16 16">
  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
</svg>
                </i>
                <img src={item.image} alt={item.name} className='prod_img_cart' />
              </div>
              <div className="price">${item.newPrice} </div>
              <div className="Quantity" style={{border:"1px solid black",width:"50px",height:"50px",display:"flex",justifyContent:"center",alignItems:"center"}}> {item.quantity} </div>
              <div className="product_subtotal">${item.newPrice * item.quantity} </div>
            
            </div>
          ))
        )
      }
      <div className="button">
      <Link to='/'>
    <button className='Return'>Return To Shop</button>
    </Link>
    <button className='checkout'>Procees To Checkout </button>
      </div>
      
        <div className="coupons">
          <input type='text'className='input_coupon' placeholder='Coupon Code' />
          <button className='btn_couppon'>Apply</button>
        </div>
      
    </div>
    
    
  )
}

export default Cart

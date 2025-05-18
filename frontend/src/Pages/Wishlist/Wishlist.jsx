import React, { useEffect, useState } from 'react';
import '../CSS/wishlist.css';
const Wishlist = () => {
    const[WishlistItems,setWishlistItems] = useState([]);
const [cartItems, setCartItems] = useState([]);
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
    useEffect(()=>{
      const fetchWishlist = async () =>{
        const token = localStorage.getItem('auth-token');
        try {
          const response = await fetch('http://localhost:4000/getFromWishlist',{
            method:'Get',
            headers:{
              'Content-Type':'application/json',
              'auth-token':token,
            },
          });
          const data = await response.json();
          if(data.success)
          {
            setWishlistItems(Array.isArray(data.Wishlist) ? data.Wishlist : []);
          }
        } catch (error) {
          console.error('Error fetching Wishlist:',error);
        }
      };
      fetchWishlist();
    },[]);
    const removeFromWishlist = async(itemId) =>{
      const  user = JSON.parse(localStorage.getItem('user'));
      setWishlistItems((prev)=>prev.filter(item => item.id !== itemId));
      if (localStorage.getItem('auth-token')) {
        fetch('http://localhost:4000/RemoveFromWishlist',{
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
        .catch((error)=>console.error('Error removing from wishlist',error))
      }else{
        alert("please authenticate first , so you can add your items to your cart ")
      }
      
    };
  return (
    <>
    <h1 className='wishlist_title'>Your Wishlist</h1>
    <div className='wishlist'>
      
     {WishlistItems.length === 0 ?(
      <p style={{display:"flex",justifyContent:"center",alignItems:"center",marginTop:"10%"}}>Your wishlist is empty</p>
     ):(
      WishlistItems.map((item)=>(
        <div className="wihlist_cart">
           <i className='bi bi-x' onClick={()=>removeFromWishlist(item.id)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="red" class="bi bi-x-lg" viewBox="0 0 16 16">
  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
</svg>
          </i>
        <div className="img_cross_icon">
          <img src={item.image} alt={item.name}  className='prod_img_wishlist'/>
        </div>
        <div className="title_prod"> {item.name} </div>
        <div className='prices'>
          <div className="newPrice"> ${item.newPrice} </div>
          <div className="oldPrice"> ${item.oldprice} </div>
        </div>
        <button className='addtocart' onClick={() => addTocart(item.id)}>Add to cart</button>
      </div>
      ))
     )
    
    }
    </div>
    </>
  )
}

export default Wishlist

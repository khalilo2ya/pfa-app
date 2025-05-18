import React from 'react'
import Apple_icon from '../../asssets/Apple_logo.png'
import hero_image from '../../asssets/hero_image.png'
import JBL_Hero from '../../asssets/JBL_BOOMBOX_HERO.png'
import BSP from '../../Component/BestSellsProduct/BSP'
import Categories from '../../Component/Categories/categories'
import Category from '../../Component/category/category'
import FlashSalesProd from '../../Component/FlashSalesProduct/flashSalesProd'
import Products from '../../Component/Products/Products'
import '../CSS/home.css'

const Home = () => {
    
  return (
    <>
    <div className='home'>
         <div className="sidebar">
         <Categories/>
         </div>
      <div className="hero" style={{backgroundColor:"#000"}}>
        <div className="heroleft" style={{color:"white"}}>
            <img src={Apple_icon} alt="" className='icon' />
            <span className='slogan'>iPhone 14 Series</span>
            <h1 className='title'>Up to 10% </h1> 
            <h1 className='title'>off Voucher</h1>
            <button className='shop_btn'>Shop Now
                <i className='bi bi-arrow'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
                </svg>
                </i>
            </button>
        </div>
        <div className="heroright" style={{color:"white"}} >
            <img src={hero_image} alt=""/>
        </div>
      </div>
    </div>
     <div className="flashSales">
     <FlashSalesProd/>
     </div>
     <div className="Category">
      <Category/>
     </div>
     <div className="BSP">
      <BSP/>
     </div>
     <div className="banner">
      <div className="LeftBanner">
        <span>categories</span>
        <p>Enhance Your Music Experience</p>
        <button>Buy Now</button>
      </div>
      <div className="rightBanner">
        <img src={JBL_Hero} alt="" />
      </div>
     </div>
     <div className="AllProducts">
      <Products/>
     </div>
     </>
  )
}

export default Home

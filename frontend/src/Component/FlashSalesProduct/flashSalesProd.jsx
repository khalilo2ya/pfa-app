import React from 'react'
import { Link } from 'react-router-dom'
import flashSalesProd from "../../asssets/Products/bestSellerProducs"
import rect_icon from '../../asssets/rect_icon.png'
import Item from '../Item/Item'
import './flashSalesProd.css'
const FlashSalesProd = () => {
  return (
    <div className='flashSalesProds'>
        <div className="title1">
            <img src={rect_icon} alt="" width={"18px"} height={"45px"} />
            <span>Today's</span>
        </div>
        <div className='titleTime'>
            <p className="title2">Flash Sales</p>
            <div className="times">
                <div className="timeUnit">
                    <span className="label">Days</span>
                    <span className="value">03   <span style={{color:"red",marginLeft:"5px",fontWeight:"100px",fontSize:"25px"}}>:</span></span>
                    
                </div>
                <div className="timeUnit">
                    <span className='label'>Hours</span>
                    <span className='value'>23   <span style={{color:"red",marginLeft:"5px" ,fontSize:"25px"}}>:</span></span>
                </div>
                <div className="timeUnit">
                    <span className='label'>Minutes</span>
                    <span className="value">19   <span style={{color:"red",marginLeft:"5px" ,fontSize:"25px"}}>:</span></span>
                </div>
                <div className="timeUnit">
                    <span className="label">Secondes</span>
                    <span className="value">56    </span>
            </div>
        </div>
            </div>
            
        <div className="Product">
            {flashSalesProd.map((item,i)=>{
                return <Item key={i} id={item.id} title={item.title} image={item.image} discount={item.discount} oldprice={item.oldprice} newprice={item.newprice} rating={item.rating}  />
            }
        )}
        </div>
        <div className="viewAll">
            <Link to={'/Collections'}>
            <button className="viewAllProd">View All Product</button>
            </Link>
        </div>
      
    </div>
  )
}

export default FlashSalesProd

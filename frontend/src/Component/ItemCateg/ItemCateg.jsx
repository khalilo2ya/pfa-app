import React from 'react'
import './ItemCateg.css'
const ItemCateg = (props) => {
  return (
    <div className='ItemCateg'>
            <img src={props.image} alt="" />
       
        <div className="titleCat">
            <span>{props.name}</span>
        </div>
    </div>
  )
}

export default ItemCateg

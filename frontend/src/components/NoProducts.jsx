import React from 'react'
import "../componentStyles/NoProducts.css";

const NoProducts = ({keyword}) => {
  return (
    <div className="no-products-content">
        <div className="no-products-icon">⚠️</div>
            <h3 className="no-products-title">No Product Found</h3>
            <p className='no-products-message'>{keyword?`We Couldn't find any products matching '${keyword}'. Try Using different Keywords or browse our complete catalog`:`No Product are available.please check back later`}</p>
        
    </div>
  )
}

export default NoProducts
import React from 'react'
import'../CartStyles/Cart.css';
import PageTitle from '../components/PageTitle';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import CartItem from './CartItem';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

function Cart() {
    const{cartItems}=useSelector((state)=>state.cart);
    // console.log(cartItems);
    const subTotal=cartItems.reduce((acc,item)=>acc+(item.price*item.quantity),0)
    // console.log(subTotal);
    const tax=subTotal*0.18;
    const shipping=subTotal>500?0:50;
    const total=subTotal+tax+shipping
    const navigate=useNavigate()
    const checkoutHandler=()=>{
          navigate(`/login?redirect=/shipping`)
    }

  return (
    <>
     <PageTitle title={'Your Cart'}/>
    <Navbar/>
    {cartItems.length===0 ? (
        <div className="empty-cart-container">
            <p className="empty-cart-message">Your Cart is Empty</p>
            <Link to='/products' className='viewProducts'>View Products</Link>
        </div>
    ):(
        <>
    <div className="cart-page">
        <div className="cart-items">
            <div className="cart-items-heading">Your Cart</div>
            <div className="cart-table">
                <div className="cart-table-header">
                    <div className="header-product">Product</div>
                    <div className="header-quantity">Quantity</div>
                    <div className="header-total item-total-heading">Item Total</div>
                    <div className="header-action">Actions</div>
                </div>
                {/*Cart Items */}
                {cartItems && cartItems.map(item=><CartItem key={item.name} item={item}/>)}
                
            </div>
        </div>

        {/*Price Summary */}
        <div className="price-summary">
            <h3 className="price-summary-heading">Price Summary</h3>
            <div className="summary-item">
                <p className="summary-label">SubTotal :</p>
                <p className="summary-value">{subTotal}/-</p>
            </div>
            <div className="summary-item">
                <p className="summary-label">Tax (18%):</p>
                <p className="summary-value">{tax}/-</p>
            </div>
            <div className="summary-item">
                <p className="summary-label">Shipping :</p>
                <p className="summary-value">{shipping}/-</p>
            </div>
            <div className="summary-total">
                <p className="total-label">Total :</p>
                <p className="total-value">{total}/-</p>
            </div>
            <button className="checkout-btn" onClick={checkoutHandler}>Proceed to Checkout</button>
        </div>
    </div>
    

   
    
    </>
    )}
     <Footer/>
    </>
    
  )
}

export default Cart
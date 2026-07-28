import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { addItemsToCart, removeErrors, removeItemFromCart, removeMessage } from '../features/cart/cartSlice';
import { useDispatch, useSelector } from 'react-redux';

function CartItem({item}) {
    // console.log('cart',item);
    const{loading,success,error,message,cartItems}=useSelector(state=>state.cart);
    const dispatch=useDispatch();
    const[quantity,setQuantity]=useState(item.quantity);


    const decreaseQuantity=()=>{
            if(quantity<=1){
                toast.error("Quantity Cannot be Less than 1",{position:"top-center",autoClose:3000})
                dispatch(removeErrors())
                return;
            }
            setQuantity(qty=>qty-1);
    
        }
    
        const increaseQuantity=()=>{
            if(item.stock<=quantity){
                toast.error("Cannot Exceed Available Stock!",{position:"top-center",autoClose:3000})
                dispatch(removeErrors())
                return;
            }
            setQuantity(qty=>qty+1);
        }

        const handleUpdate=()=>{
            if(loading) return;
            if(quantity!==item.quantity){
                dispatch(addItemsToCart({id:item.product,quantity}))
            }
        }

        useEffect(()=>{
                  if(error){
                    toast.error(error.message,{position:"top-center",autoClose:3000});
                    dispatch(removeErrors())
                  }
                  
            
            },[dispatch,error]);
        
            useEffect(()=>{
                  if(success){
                    toast.success(message,{position:"top-center",autoClose:3000,toastId:'cart-update'});
                    dispatch(removeMessage())
                  }    
            },[dispatch,success,message]);

            const handleRemove=()=>{
                if(loading) return;
                dispatch(removeItemFromCart(item.product))
                toast.success('Item Remove From Cart Successfully',{position:"top-center",autoClose:3000});
            }
    
  return (
     <div className="cart-item">
                <div className="item-info">
                    <img src={item.image} alt={item.name} className='item-image' />
                    <div className="item-details">
                        <h3 className="item-name">{item.name}</h3>
                        <p className="item-price"><strong>Price :</strong>{item.price.toFixed(2)}/-</p>
                        <p className='item-quantity'><strong>Quantity :</strong> {item.quantity} </p>
                    </div>
                </div>
                <div className="quantity-controls">
                    <button className="quantity-button decrease-btn" disabled={loading} onClick={decreaseQuantity}>-</button>
                    <input type="number" value={quantity} className='quantity-input' readOnly min='1'/>
                    <button className="quantity-button increase-btn" disabled={loading} onClick={increaseQuantity}>+</button>
                </div>
                <div className="item-total"><strong className="item-total-price">{(item.price*item.quantity).toFixed(2)}/-</strong></div>
                <div className="item-actions">
                <button className="update-item-btn" disabled={loading || quantity===item.quantity} onClick={handleUpdate}>{loading ? "Updating":"Update"}</button>
                <button className="remove-item-btn" onClick={handleRemove} disabled={loading}>Remove</button>
                </div>
                </div>
  )
}

export default CartItem
import React from 'react'
import '../AdminStyles/UpdateOrder.css';
import Navbar from '../components/Navbar';
import PageTitle from '../components/PageTitle';
import Footer from '../components/Footer';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getOrderDetails } from '../features/order/orderSlice';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { removeErrors, removeSuccess, updateOrderStatus } from '../features/admin/adminSlice';

function UpdateOrder() {
  const[status,setStatus]=useState('');
  const {orderId}=useParams();
  const {order,loading:orderLoading}=useSelector(state=>state.order);
  const {error,success,loading:adminLoading}=useSelector(state=>state.admin);
  // console.log(order);
  const loading=orderLoading || adminLoading;
  const dispatch=useDispatch();
  useEffect(()=>{
    if(orderId){
      dispatch(getOrderDetails(orderId))
    }
  },[orderId,dispatch])

  const {
    shippingInfo={},
    paymentInfo={},
    orderItems=[],
    orderStatus,
    totalPrice, 

  }=order;
  const paymentStatus=paymentInfo.status==='succeeded'?'Paid':'Not Paid';
  const finalOrderStatus=paymentStatus==='Not Paid'?'Cancelled':orderStatus;
  const handleStatusUpdate=()=>{
    if(!status){
      toast.error("Please Select a Status",{position:'top-center',autoClose:3000})
      return
    }
    dispatch(updateOrderStatus({orderId,status}))
  }

  useEffect(()=>{
    if(error){
      toast.error(error,{position:'top-center',autoClose:3000})
      dispatch(removeErrors());
    }
    if(success){
      toast.success('Order Status Updated Successfully',{position:'top-center',autoClose:3000})
      dispatch(removeSuccess());
      dispatch(getOrderDetails(orderId));
      
    }
  },[dispatch,error,success,orderId])
  return (
    <>
    {loading ? (<Loader/>):( <>
    <PageTitle title='Update Order'/>
    <Navbar/>
    <div className="order-container">
      <h1 className="order-title">Update Order</h1>
      <div className="order-details">
        <p><strong>Order Id: </strong>{orderId}</p>
        <p><strong>Shipping Address: </strong>{shippingInfo.address},{shippingInfo.city},{shippingInfo.state},{shippingInfo.country},{shippingInfo.pinCode}</p>
        <p><strong>Phone: </strong>{shippingInfo.phoneNo}</p>
        <p><strong>Order Status: </strong>{finalOrderStatus}</p>
        <p><strong>Payment Status: </strong>{paymentStatus}</p>
        <p><strong>Total Price: </strong>{totalPrice}/-</p>
      </div>

      <div className="order-items">
        <h2>Order Items</h2>
        <table className="order-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item,index)=>(
              <tr key={item._id}>
              <td>
                <img src={item.image} alt={item.name} className='order-item-image' />
              </td>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.price}/-</td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="order-status">
        <h2>Update Status</h2>
        <select className='status-select' value={status} disabled={loading || orderStatus==='Delivered'} onChange={(e)=>setStatus(e.target.value)}>
          <option value="">Select Status</option>
          <option value="Shipped">Shipped</option>
          <option value="On The Way">On The Way</option>
          <option value="Delivered">Delivered</option>
        </select>
        <button className="update-button" disabled={loading || !status || orderStatus==='Delivered'} onClick={handleStatusUpdate}>Update Status</button>
      </div>
    </div>
    <Footer/>
    </>)}
    </>
   
  )
}

export default UpdateOrder
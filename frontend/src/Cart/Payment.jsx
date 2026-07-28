import React from 'react'
import'../CartStyles/Payment.css'
import PageTitle from '../components/PageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { CheckoutPath } from './CheckoutPath'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'
import {toast} from 'react-toastify'

function Payment() {
    const orderItem=JSON.parse(sessionStorage.getItem('orderItem'))
    const {user}=useSelector(state=>state.user);
    const {shippingInfo}=useSelector(state=>state.cart);
    const navigate=useNavigate();
    const completePayment=async(amount)=>{
      try{
        // console.log(amount);
        const {data:keyData}=await axios.get('/api/v1/getkey');
        // console.log(keyData);
        const {key}=keyData;
        // console.log(key);
        const {data:orderData}=await axios.post('/api/v1/payment/process',{amount});
        // console.log(orderData);
        const {order}=orderData;
        // console.log(order);
        const options = {
        key: key, // Replace with your Razorpay key_id
        amount: amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: 'INR',
        name: 'Shop Easy',
        description: 'Ecommerce Website',
        order_id: order.id, // This is the order_id created in the backend
        // callback_url: '/api/v1/paymentVerification', // Your success URL
        handler:async (response)=>{
          // console.log('RaxzorPay Response fend',response);
          
          const {data}=await axios.post('/api/v1/paymentVerification',{
            razorpay_payment_id:response.razorpay_payment_id,
            razorpay_order_id:response.razorpay_order_id,
            razorpay_signature:response.razorpay_signature,
          });
          // console.log('fend data',data);
          
          if(data.success){
            navigate(`/paymentSuccess?reference=${data.reference}`)
          }
          else{
            alert('Payment Verification Failed')
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: shippingInfo.phoneNumber
        },
        theme: {
          color: '#F37254'
        },
      };
      const rzp = new Razorpay(options);
      rzp.open();
    }
    catch(error){
       toast.error(error.message,{position:'top-center',autoClose:3000})
    }

  }
  return (
    <>
    <PageTitle title='Payment Processing'/>
    <Navbar/>
     <CheckoutPath activePath={2}/>
     <div className="payment-container">
        <Link to='/order/confirm' className='payment-go-back'>Go Back</Link>
        <button className='payment-btn' onClick={()=>completePayment(orderItem.total)}>Pay ({orderItem.total})/-</button>
     </div>
    <Footer/>
    </>
  )
}

export default Payment
import React, { useEffect } from 'react'
import PageTitle from '../components/PageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../AdminStyles/OrdersList.css';
import { Delete, Edit } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearMessage, deleteOrder, fetchAllOrders, removeErrors, removeSuccess } from '../features/admin/adminSlice';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

function OrdersList() {
    const{loading,error,orders,success,message}=useSelector(state=>state.admin);
    // console.log(orders);
    
    const dispatch=useDispatch();

    useEffect(()=>{
        dispatch(fetchAllOrders())
    },[dispatch])


    const handleDelete=(id)=>{
       const confirm=window.confirm('Are you Sure You want to delete this User?');
       if(confirm){
        dispatch(deleteOrder(id))
       }
    }

    useEffect(()=>{
        if(error){
            toast.error(error,{position:'top-center',autoClose:3000})
            dispatch(removeErrors())
        }
    },[dispatch,error])

     useEffect(()=>{
        if(success){
            toast.success(message,{position:'top-center',autoClose:3000})
            dispatch(removeSuccess());
            dispatch(clearMessage());
            dispatch(fetchAllOrders());
        }
    },[dispatch,success,message])

    if(orders && orders.length===0){
        return(
            <div className="no-orders-container">
                <p>No orders Found</p>
            </div>
        )
    }

  return (
    <>
    {loading ?(<Loader/>):(
        <>
    <PageTitle title='All Orders'/>
    <Navbar/>
    <div className="ordersList-container">
        <h1 className="ordersList-title">All Orders</h1>
        <div className="ordersList-table-container">
            <table className="ordersList-table">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Order Id</th>
                        <th>Status</th>
                        <th>Total Price</th>
                        <th>Number Of Items</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders && orders.map((order,index)=>(
                      <tr key={order._id}>
                        <td>{index+1}</td>
                        <td>{order._id}</td>
                        <td className={`order-status ${order.orderStatus.toLowerCase()}`}>{order.orderStatus}</td>
                        <td>{order.totalPrice.toFixed(2)}/-</td>
                        <td>{order.orderItems.length}</td>
                        <td>
                            <Link to={`/admin/order/${order._id}`} className='action-icon edit-icon'><Edit/></Link>
                            <button className='action-btn delete-icon' onClick={()=>handleDelete(order._id)}><Delete/></button>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
    <Footer/>
    </>
    )}
    </>
    
  )
}

export default OrdersList
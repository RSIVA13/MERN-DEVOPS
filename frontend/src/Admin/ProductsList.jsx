import React, { useEffect } from 'react'
import '../AdminStyles/ProductsList.css';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Delete, Edit } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct, fetchAdminProducts, removeErrors, removeSuccess } from '../features/admin/adminSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

function ProductsList() {
    const{products,error,loading,deleting}=useSelector(state=>state.admin);
    // console.log(products);
    const dispatch=useDispatch();

    useEffect(()=>{
      dispatch(fetchAdminProducts());
    },[dispatch])

    useEffect(()=>{
      if(error){
        toast.error(error,{position:'top-center',autoClose:3000})
        dispatch(removeErrors())
      }
    },[error,dispatch])
    
    if(!products || products.length===0){
        return(
            <div className="product-list-container">
                <h1 className="product-list-title">Admin Products</h1>
                <p className="no-admin-products">No Product Found</p>
            </div>
        )
    }

    const handleDelete=(productId)=>{
       const isConfirmed=window.confirm('Are You Sure You Want to Delete this Product?');
       if(isConfirmed){
         dispatch(deleteProduct(productId)).then((action)=>{
          if(action.type==='admin/deleteProduct/fulfilled'){
            toast.success('product Deleted Successful',{position:'top-center',autoClose:3000})
            dispatch(removeSuccess())
          }
         })
       }
       
    }

    
  return (
    <>
    {loading ? (<Loader/>):(
        <>
    <PageTitle title='All Products'/>
    <Navbar/>
    <div className="product-list-container">
        <h1 className="product-list-title">All products</h1>
        <table className="product-table">
            <thead>
                <tr>
                    <th>S.No</th>
                    <th>Product Image</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Ratings</th>
                    <th>category</th>
                    <th>Stock</th>
                    <th>Created At</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {products.map((product,index)=>(
                  <tr key={product._id}>
                    <td>{index+1}</td>
                    <td><img src={product.image[0].url} alt={product.name} className='admin-product-image' /></td>
                    <td>{product.name}</td>
                    <td>{product.price}/-</td>
                    <td>{product.ratings}</td>
                    <td>{product.category}</td>
                    <td>{product.stock}</td>
                    <td>{new Date(product.createdAt).toLocaleString()}</td>
                    <td>
                        <Link to={`/admin/product/${product._id}`} className='action-icon edit-icon'><Edit/></Link>
                        <button className="action-icon delete-icon" disabled={deleting[product._id]} onClick={()=>handleDelete(product._id)}>{deleting[product._id] ? <Loader/>:<Delete/>}</button>
                        
                    </td>
                </tr>
                ))}
            </tbody>
        </table>
    </div>
    <Footer/>
    </>
    )}
    </>

  )
}

export default ProductsList
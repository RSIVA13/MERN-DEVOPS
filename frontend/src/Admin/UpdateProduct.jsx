import React, { useEffect, useState } from 'react'
import '../AdminStyles/UpdateProduct.css';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductDetails } from '../features/products/productSlice';
import { removeErrors, removeSuccess, updateProduct } from '../features/admin/adminSlice';
import { toast } from 'react-toastify';

function UpdateProduct() {
    const[name,setName]=useState('');
    const[price,setPrice]=useState('');
    const[description,setDescription]=useState('');
    const[category,setCategory]=useState('');
    const[stock,setStock]=useState('');
    const[image,setImage]=useState([]);
    const[oldImage,setOldImage]=useState([]);
    const[imagePreview,setImagePreview]=useState([]);

    const categories=['Laptop','Fruits','Furniture','Plastic Items','Bag','Glass','Dress','Watch','Electronics','Electrical','Phone'];

    const{product}=useSelector(state=>state.product);
    // console.log(product);
    const {error,success,loading}=useSelector(state=>state.admin);

    
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const {updateId}=useParams();

    useEffect(()=>{
        dispatch(getProductDetails(updateId))
    },[dispatch,updateId])
     
    useEffect(()=>{
        if(product){
            setName(product.name);
            setPrice(product.price);
            setDescription(product.description);
            setStock(product.stock);
            setCategory(product.category);
            setOldImage(product.image);
            
        }
    },[product])


    

    const handleImageChange=(e)=>{
        const files=Array.from(e.target.files)
    //   console.log(files);
      setImage([]);
      setImagePreview([]);

      files.forEach((file)=>{
        const reader=new FileReader();
        reader.onload=()=>{
           if(reader.readyState===2){
            setImagePreview((old)=>[...old,reader.result])
            setImage((old)=>[...old,reader.result])
           }
        }
        reader.readAsDataURL(file);
      })
    }

    const updateProductSubmit=(e)=>{
        e.preventDefault();
        const myForm=new FormData();
        myForm.set('name',name);
        myForm.set('price',price);
        myForm.set('description',description);
        myForm.set('category',category);
        myForm.set('stock',stock);
        image.forEach((img)=>{
            myForm.append('image',img)
        })
        dispatch(updateProduct({id:updateId,formData:myForm}))
    }

    useEffect(()=>{
        if(error){
            toast.error(error,{position:'top-center',autoClose:3000})
            dispatch(removeErrors())
        }
        if(success){
            toast.success('Product Updated Successful',{position:'top-center',autoClose:3000})
            dispatch(removeSuccess())
            navigate('/admin/products')
        }
    },[dispatch,success,error])
  return (
    <>
    <PageTitle title='Update Product'/>
    <Navbar/>
    <div className="update-product-wrapper">
        <h1 className="update-product-title">Update Product</h1>
        <form className='update-product-form' encType='multipart/form-data' onSubmit={updateProductSubmit}>

        <label htmlFor="name">Product Name</label>
        <input type="text" id='name' name='name' value={name} onChange={(e)=>setName(e.target.value)} className='update-product-input' required/>

        <label htmlFor="price">Product Price</label>
        <input type="number" id='price' name='price'  value={price} onChange={(e)=>setPrice(e.target.value)} className='update-product-input' required/>

        <label htmlFor="description">Product Description</label>
        <textarea type="text" id='description'  value={description} onChange={(e)=>setDescription(e.target.value)} name='description' className='update-product-textarea' required/>

        <label htmlFor="category">Product Category</label>
        <select name="category" id="category"  value={category} onChange={(e)=>setCategory(e.target.value)} className='update-product-select'>
            <option value="">Choose a Category</option>
            {categories.map((item)=>(
                <option value={item} key={item}>{item}</option>
            ))}
        </select>

        <label htmlFor="stock">Product Stock</label>
        <input type="number" id='stock'  value={stock} onChange={(e)=>setStock(e.target.value)} name='stock' className='update-product-input' required/>

        <label htmlFor="image">Product Images</label>

        <div className='update-product-file-wrapper'>
        <input type="file" id='image' accept='image/' name='image' multiple onChange={handleImageChange} className='update-product-file-input'/>
        </div>

        <div className='update-product-preview-wrapper'>
            {imagePreview.map((img,index)=>(
              <img src={img} key={index} alt="Product Preview" className='update-product-preview-image'/>
            ))}
        </div>

        <div className='update-product-old-images-wrapper'>
            {oldImage.map((img,index)=>(
              <img src={img.url} key={index} alt="Old Product Preview" className='update-product-old-image'/>
            ))}
        </div>
         <button className='update-product-submit-btn'>{loading ? 'Updating...':'Update'}</button>
        </form>
    </div>
    <Footer/>
    
    </>
  )
}

export default UpdateProduct
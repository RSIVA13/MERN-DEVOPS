import React, { useEffect, useState } from 'react'
import '../AdminStyles/UpdateRole.css';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleUser, removeErrors, removeSuccess, updateUserRole } from '../features/admin/adminSlice';
import { toast } from 'react-toastify';

function UpdateRole() {
    const {userId}=useParams();
    const {loading,error,user,success}=useSelector(state=>state.admin);
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const[formData,setFormData]=useState({
        name:'',
        email:'',
        role:''
    });

    useEffect(()=>{
       dispatch(getSingleUser(userId))
    },[dispatch])

    const {name,email,role}=formData;

    useEffect(()=>{
        if(user){
            setFormData({
                name:user.name || '',
                email:user.email || '',
                role:user.role || ''
            })
        }
    },[user])

    const handleChange=(e)=>{
        setFormData({...formData,[e.target.name]:e.target.value})
    }

    const handleSubmit=(e)=>{
         e.preventDefault();
         dispatch(updateUserRole({id:userId,role}))
    }
    

    useEffect(()=>{
        if(error){
            toast.error(error,{position:'top-center',autoClose:3000})
            dispatch(removeErrors())
        }
        if(success){
            toast.success("Role Updated Successfully",{position:'top-center',autoClose:3000})
            dispatch(removeSuccess());
            navigate('/admin/users')
        }

    },[dispatch,error,success])
  return (
    <>
    <PageTitle title='Update User Role'/>
    <Navbar/>
    <div className="page-wrapper">
        <div className="update-user-role-container">
            <h1>Update User Role</h1>
            <form className="update-user-role-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" name='name' id='name' value={name} readOnly />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" name='email' id='email' value={email} readOnly />
                </div>
                <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <select name="role" id="role" value={role} onChange={handleChange} required>
                        <option value="">Select Role</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button className="btn btn-primary">Update Role</button>
            </form>
        </div>
    </div>
    <Footer/>
    </>
  )
}

export default UpdateRole
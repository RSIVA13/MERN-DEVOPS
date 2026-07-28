import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import "../UserStyles/Form.css";
import PageTitle from '../components/PageTitle';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, removeErrors, removeSuccess } from '../features/user/userSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

const ForgotPassword = () => {
    const{error,message,loading,success}=useSelector(state=>state.user);
    const dispatch=useDispatch();
    const[email,setEmail]=useState("");
    const forgotPasswordEmail=(e)=>{
        e.preventDefault();
        const myForm=new FormData();
        myForm.set("email",email)
        dispatch(forgotPassword(myForm))
        setEmail('');
    }

    useEffect(()=>{
                  if(error){
                    toast.error(error,{position:"top-center",autoClose:3000});
                    dispatch(removeErrors())
                  }
            
    },[dispatch,error]);


    useEffect(()=>{
                if(success){
                    toast.success(message,{position:"top-center",autoClose:3000});
                    dispatch(removeSuccess())
                            
                }
                    
    },[dispatch,success]);
  return (
    <>
    {loading ? (<Loader/>):(
    <>
    <PageTitle title="Forgot Password"/>
    <Navbar/>
    <div className="container forgot-container">
        <div className="form-content email-group">
        <form className="form" onSubmit={forgotPasswordEmail}>
            <h2>Forgot Password</h2>
            <div className="input-group">
                <input type="email" name='email' placeholder='Enter Registered Email' value={email} onChange={(e)=>setEmail(e.target.value)} />
            </div>
            <button className='authBtn'>Send</button>
        </form>
         </div>
    </div>
    <Footer/>
    </>
    )}
   
    </>
  )
}

export default ForgotPassword
import React, { useEffect } from 'react'
import '../AdminStyles/UsersList.css';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Delete, Edit } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearMessage, deleteUser, fetchUsers, removeErrors, removeSuccess } from '../features/admin/adminSlice';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

export const UsersList = () => {
    const {users,error,loading,message}=useSelector(state=>state.admin);
    const dispatch=useDispatch();
    const navigate=useNavigate();
    // console.log(users);
    

    useEffect(()=>{
       dispatch(fetchUsers())
    },[dispatch])

    useEffect(()=>{
      if(error){
        toast.error(error,{position:'top-center',autoClose:3000})
        dispatch(removeErrors())
      }
    },[dispatch,error])


    const handleDelete=(userId)=>{
      const confirm=window.confirm('Are you Sure You want to delete this User?')
      if(confirm){
         dispatch(deleteUser(userId))
      }
    }

    useEffect(()=>{
      if(error){
        toast.error(error,{position:'top-center',autoClose:3000})
        dispatch(removeErrors())
      }
      if(message){
        toast.success(message,{position:'top-center',autoClose:3000})
        dispatch(clearMessage())
        navigate('/admin/dashboard')
      }
    },[dispatch,error,message])

  return (
    <>
    {loading ? (<Loader/>):( <>
    <PageTitle title='All Users'/>
    <Navbar/>
     <div className="usersList-container">
        <h1 className="usersList-title">All Users</h1>
        <div className="usersList-table-container">
            <table className="usersList-table">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user,index)=>(
                       <tr key={user._id}>
                        <td>{index+1}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{new Date(user.createdAt).toLocaleString()}</td>
                        <td>
                            <Link to={`/admin/user/${user._id}`} className='action-icon edit-icon'><Edit/></Link>
                            <button className='action-icon delete-icon' onClick={()=>handleDelete(user._id)}><Delete/></button>
                        </td>
                    </tr>
                    ))}
                    
                </tbody>
            </table>
        </div>
     </div>
    <Footer/>
    </>)}
    </>
   
    
  )
}

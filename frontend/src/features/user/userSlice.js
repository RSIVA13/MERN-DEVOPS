import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import UpdatePassword from "../../User/UpdatePassword";
import ForgotPassword from "../../User/ForgotPassword";

//Register Api
export const register=createAsyncThunk('user/register',async(userData,{rejectWithValue})=>{
    try{
        const config={
            headers:{
                'Content-Type':'multipart/form-data'
            }
        }
        const {data}=await axios.post('/api/v1/register',userData,config);
        // console.log("Registration data",data);
        return data
        
    }
    catch(error){
        return rejectWithValue(error.response?.data || "Registration failed.please try again later")
    }
})

//login api
export const login=createAsyncThunk('user/login',async({email,password},{rejectWithValue})=>{
    try{
        const config={
            headers:{
                'Content-Type':'application/json'
            }
        }
        const {data}=await axios.post('/api/v1/login',{email,password},config);
        // console.log("Login data",data);
        return data
        
    }
    catch(error){
        return rejectWithValue(error.response?.data || "Login failed.please try again later")
    }
})

export const loadUser=createAsyncThunk('user/loadUser',async(_,{rejectWithValue})=>{
    try{
        const {data}=await axios.get('/api/v1/profile');
        return data
    }
    catch(error){
        return rejectWithValue(error.response?.data || "Failed to load User Profile")
    }
})


export const logout=createAsyncThunk('user/logout',async(_,{rejectWithValue})=>{
    try{
        const {data}=await axios.post('/api/v1/logout',{withCredentials:true});
        return data
    }
    catch(error){
        return rejectWithValue(error.response?.data || "Failed to logout")
    }
})


export const updateProfile=createAsyncThunk('user/updateProfile',async(userData,{rejectWithValue})=>{
    try{
         const config={
            headers:{
                'Content-Type':'multipart/form-data'
            }
        }
        const {data}=await axios.put('/api/v1/profile/update',userData,config);
        return data
    }
    catch(error){
        return rejectWithValue(error.response?.data || {message:'Profile Update Failed Please Try again later'})
    }
})

export const updatePassword=createAsyncThunk('user/updatePassword',async(formData,{rejectWithValue})=>{
    try{
         const config={
            headers:{
                'Content-Type':'application/json'
            }
        }
        const {data}=await axios.put('/api/v1/password/update',formData,config);
        return data
    }
    catch(error){
        return rejectWithValue(error.response?.data || 'Password Update Failed Please Try again later')
    }
})


export const forgotPassword=createAsyncThunk('user/forgotPassword',async(email,{rejectWithValue})=>{
    try{
         const config={
            headers:{
                'Content-Type':'application/json'
            }
        }
        const {data}=await axios.post('/api/v1/password/forgot',email,config);
        return data
    }
    catch(error){
        return rejectWithValue(error.response?.data || {message:'Email Sent Failed'})
    }
})


export const resetPassword=createAsyncThunk('user/resetPassword',async({token,userData},{rejectWithValue})=>{
    try{
         const config={
            headers:{
                'Content-Type':'application/json'
            }
        }
        const {data}=await axios.post(`/api/v1/reset/${token}`,userData,config);
        return data
    }
    catch(error){
        return rejectWithValue(error.response?.data || 'Reset Password Failed')
    }
})

const userSlice=createSlice({
    name:'user',
    initialState:{
        user:localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')):null,
        loading:false,
        error:null,
        success:false,
        isAuthenticated:localStorage.getItem('isAuthenticated')==='true',
        message:null
    },
    reducers:{
        removeErrors:(state)=>{
            state.error=null
        },
        removeSuccess:(state)=>{
            state.success=null
        }
    },
    extraReducers:(builder)=>{
    //Register User
        builder.addCase(register.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(register.fulfilled,(state,action)=>{
            state.loading=false;
            state.error=null;
            state.success=action.payload.success;
            state.user=action.payload?.user || null;
            state.isAuthenticated=Boolean(action.payload?.user)

            //Store in Localstorage
            localStorage.setItem('user',JSON.stringify(state.user));
            localStorage.setItem('isAuthenticated',JSON.stringify(state.isAuthenticated))
        })
        .addCase(register.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || 'Registration failed.please try again later';
            state.user=null;
            state.isAuthenticated=false;
        })


         //Login User
        builder.addCase(login.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(login.fulfilled,(state,action)=>{
            state.loading=false;
            state.error=null;
            state.success=action.payload.success;
            state.user=action.payload?.user || null;
            state.isAuthenticated=Boolean(action.payload?.user)
            // console.log(state.user);

            //Store in Localstorage
            localStorage.setItem('user',JSON.stringify(state.user));
            localStorage.setItem('isAuthenticated',JSON.stringify(state.isAuthenticated))
            
        })
        .addCase(login.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || 'Login failed.please try again later';
            state.user=null;
            state.isAuthenticated=false;
        })


         //Loading User
        builder.addCase(loadUser.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(loadUser.fulfilled,(state,action)=>{
            state.loading=false;
            state.error=null;
            state.user=action.payload?.user || null;
            state.isAuthenticated=Boolean(action.payload?.user)

            //Store in Localstorage
            localStorage.setItem('user',JSON.stringify(state.user));
            localStorage.setItem('isAuthenticated',JSON.stringify(state.isAuthenticated))
            
        })
        .addCase(loadUser.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || 'Failed to load User Profile';
            state.user=null;
            state.isAuthenticated=false;

            if(action.payload?.statusCode===401){
                state.user=null;
                state.isAuthenticated=false;
                localStorage.removeItem('user');
                localStorage.removeItem('isAuthenticated')
            }
        })


        //Logout User
        builder.addCase(logout.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(logout.fulfilled,(state,action)=>{
            state.loading=false;
            state.error=null;
            state.user=null;
            state.isAuthenticated=false;
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated')
            
        })
        .addCase(logout.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || 'Failed to logout';
        })



         //Update User Profile
        builder.addCase(updateProfile.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(updateProfile.fulfilled,(state,action)=>{
            state.loading=false;
            state.error=null;
            state.user=action.payload?.user || null
            state.success=action.payload?.success
            state.message=action.payload?.message
            
        })
        .addCase(updateProfile.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || 'Profile Update Failed Please Try again later';
        })


         //Update Password 
        builder.addCase(updatePassword.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(updatePassword.fulfilled,(state,action)=>{
            state.loading=false;
            state.error=null;
            state.success=action.payload?.success
            
            
        })
        .addCase(updatePassword.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || 'Password Update Failed ';
        })


        //Forgot Password 
        builder.addCase(forgotPassword.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(forgotPassword.fulfilled,(state,action)=>{
            state.loading=false;
            state.error=null;
            state.success=action.payload?.success
            state.message=action.payload?.message
            
            
        })
        .addCase(forgotPassword.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || 'Email Sent Failed ';
        })


        //Reset Password 
        builder.addCase(resetPassword.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(resetPassword.fulfilled,(state,action)=>{
            state.loading=false;
            state.error=null;
            state.success=action.payload?.success
            state.user=null
            state.isAuthenticated=false
            
            
        })
        .addCase(resetPassword.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || 'Reset Password Failed ';
        })


        
    }
})

export const{removeErrors,removeSuccess}=userSlice.actions;
export default userSlice.reducer;
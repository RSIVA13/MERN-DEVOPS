import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';


//Fetch All Products
export const fetchAdminProducts=createAsyncThunk('admin/fetchAdminProducts',async(_,{rejectWithValue})=>{
    try{
          const {data}=await axios.get('/api/v1/admin/products')
          return data
    }
    catch(error){
         return rejectWithValue(error.response?.data || "Error While Fetching Products")
    }
})

//Create Products
export const createProduct=createAsyncThunk('admin/createProduct',async(productData,{rejectWithValue})=>{
    try{
          const config={
            headers:{
                'Content-Type':'multipart/form-data'
            }
          }
          const {data}=await axios.post('/api/v1/admin/product/create',productData,config)
          return data
    }
    catch(error){
         return rejectWithValue(error.response?.data || "Product Creation Failed")
    }
})

//Update Product
export const updateProduct=createAsyncThunk('admin/updateProduct',async({id,formData},{rejectWithValue})=>{
    try{
          const config={
            headers:{
                'Content-Type':'multipart/form-data'
            }
          }
          const {data}=await axios.put(`/api/v1/admin/product/${id}`,formData,config)
          return data
    }
    catch(error){
         return rejectWithValue(error.response?.data || "Product Update Failed")
    }
})

//Delete Product
export const deleteProduct=createAsyncThunk('admin/deleteProduct',async(productId,{rejectWithValue})=>{
    try{
          const {data}=await axios.delete(`/api/v1/admin/product/${productId}`)
          return {productId,data}
    }
    catch(error){
         return rejectWithValue(error.response?.data || "Product Delete Failed")
    }
})


//Fetch All Users 
export const fetchUsers=createAsyncThunk('admin/fetchUsers',async(_,{rejectWithValue})=>{
    try{
          const {data}=await axios.get(`/api/v1/admin/users`)
          return data
    }
    catch(error){
         return rejectWithValue(error.response?.data || "Error While Fetching Users")
    }
})


//Get Single User
export const getSingleUser=createAsyncThunk('admin/getSingleUser',async(id,{rejectWithValue})=>{
    try{
          const {data}=await axios.get(`/api/v1/admin/user/${id}`)
          return data
    }
    catch(error){
         return rejectWithValue(error.response?.data || "Failed to Fetch Single User")
    }
})


//Update User role
export const updateUserRole=createAsyncThunk('admin/updateUserRole',async({id,role},{rejectWithValue})=>{
    try{
          const {data}=await axios.put(`/api/v1/admin/user/${id}`,{role})
          return data
    }
    catch(error){
         return rejectWithValue(error.response?.data || "Failed to Update User role")
    }
})

//delete User 
export const deleteUser=createAsyncThunk('admin/deleteUser',async(id,{rejectWithValue})=>{
    try{
          const {data}=await axios.delete(`/api/v1/admin/user/${id}`)
          return data
    }
    catch(error){
         return rejectWithValue(error.response?.data || "Failed to Delete User")
    }
})


//Fetch All Orders 
export const fetchAllOrders=createAsyncThunk('admin/fetchAllOrders',async(_,{rejectWithValue})=>{
    try{
          const {data}=await axios.get('/api/v1/admin/orders')
          return data
    }
    catch(error){
         return rejectWithValue(error.response?.data || "Failed to Fetch All Orders")
    }
})


//Delete Order
export const deleteOrder=createAsyncThunk('admin/deleteOrder',async(id,{rejectWithValue})=>{
    try{
          const {data}=await axios.delete(`/api/v1/admin/order/${id}`)
          return data
    }
    catch(error){
         return rejectWithValue(error.response?.data || "Failed to Delete Order")
    }
})

//Update Order Status
export const updateOrderStatus=createAsyncThunk('admin/updateOrderStatus',async({orderId,status},{rejectWithValue})=>{
    try{
          const config={
            headers:{
                'Content-Type':'application/json'
            }
          }
          const {data}=await axios.put(`/api/v1/admin/order/${orderId}`,{status},config)
          return data
    }
    catch(error){
         return rejectWithValue(error.response?.data || "Failed to Update Order Status")
    }
})


//Fetch Product Reviews
export const fetchProductReviews=createAsyncThunk('admin/fetchProductReviews',async(productId,{rejectWithValue})=>{
    try{
          const {data}=await axios.get(`/api/v1/admin/reviews?id=${productId}`)
          return data
    }
    catch(error){
         return rejectWithValue(error.response?.data || "Failed to Fetch Product Reviews")
    }
})


//Delete Product Review
export const deleteReview=createAsyncThunk('admin/deleteReview',async({productId,reviewId},{rejectWithValue})=>{
    try{
          const {data}=await axios.delete(`/api/v1/admin/reviews?productId=${productId}&id=${reviewId}`)
          return data
    }
    catch(error){
         return rejectWithValue(error.response?.data || "Failed to Delete Product Review")
    }
})

const adminSlice=createSlice({
    name:'admin',
    initialState:{
        products:[],
        error:null,
        success:false,
        loading:false,
        product:{},
        deleting:{},
        users:[],
        user:{},
        message:null,
        orders:[],
        totalAmount:0,
        order:{},
        reviews:[]
    },
    reducers:{
        removeErrors:(state)=>{
            state.error=null
        },
        removeSuccess:(state)=>{
            state.success=false
        },
        clearMessage:(state)=>{
            state.message=null
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchAdminProducts.pending,(state)=>{
            state.loading=true;
            state.error=null;

        })
        .addCase(fetchAdminProducts.fulfilled,(state,action)=>{
            state.loading=false;
            state.products=action.payload.products;
            
        })
        .addCase(fetchAdminProducts.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || 'Error While Fetching Products'
            
        })

        
        //Create Product
        builder.addCase(createProduct.pending,(state)=>{
            state.loading=true;
            state.error=null;

        })
        .addCase(createProduct.fulfilled,(state,action)=>{
            state.loading=false;
            state.success=action.payload.success
            state.products.push(action.payload.Product);
            // console.log(state.products);
            
            
            
        })
        .addCase(createProduct.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || 'Product Creation Failed'
            
        })


        //Update Product
        builder.addCase(updateProduct.pending,(state)=>{
            state.loading=true;
            state.error=null;

        })
        .addCase(updateProduct.fulfilled,(state,action)=>{
            state.loading=false;
            state.product=action.payload.Product;
            state.success=action.payload.success;
        })
        .addCase(updateProduct.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || 'Product Update Failed'
            
        })


         //Delete Product
        builder.addCase(deleteProduct.pending,(state,action)=>{
            const productId=action.meta.arg;
            state.deleting[productId]=true;
            state.error=null;

        })
        .addCase(deleteProduct.fulfilled,(state,action)=>{
            const productId=action.payload.productId;
            state.deleting[productId]=false;
            state.products=state.products.filter(product=>product._id!==productId)
        })
        .addCase(deleteProduct.rejected,(state,action)=>{
            const productId=action.meta.arg;
            state.deleting[productId]=false;
            state.error=action.payload?.message || 'Product Deletion Failed'
            
        })


        //Fetch All users
        builder.addCase(fetchUsers.pending,(state)=>{
            state.loading=true;
            state.error=null;

        })
        .addCase(fetchUsers.fulfilled,(state,action)=>{
            state.loading=false;
            state.users=action.payload.users;
        })
        .addCase(fetchUsers.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || 'Error While Fetching Users';
            
        })


        //Get Single user
        builder.addCase(getSingleUser.pending,(state)=>{
            state.loading=true;
            state.error=null;

        })
        .addCase(getSingleUser.fulfilled,(state,action)=>{
            state.loading=false;
            state.user=action.payload.user;
        })
        .addCase(getSingleUser.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || 'Failed to Fetch Single User';
            
        })

         //Update user role
        builder.addCase(updateUserRole.pending,(state)=>{
            state.loading=true;
            state.error=null;

        })
        .addCase(updateUserRole.fulfilled,(state,action)=>{
            state.loading=false;
            state.success=action.payload.success;
        })
        .addCase(updateUserRole.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || 'Failed to Update User Role';
            
        })


         //Delete User
        builder.addCase(deleteUser.pending,(state)=>{
            state.loading=true;
            state.error=null;

        })
        .addCase(deleteUser.fulfilled,(state,action)=>{
            state.loading=false;
            state.message=action.payload.message;
        })
        .addCase(deleteUser.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || 'Failed to Delete User';
            
        })


         //Fetch All orders
        builder.addCase(fetchAllOrders.pending,(state)=>{
            state.loading=true;
            state.error=null;

        })
        .addCase(fetchAllOrders.fulfilled,(state,action)=>{
            state.loading=false;
            state.orders=action.payload.orders;
            state.totalAmount=action.payload.totalAmount;
        })
        .addCase(fetchAllOrders.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || 'Failed to Fetch All orders';
            
        })


        //Delete order
        builder.addCase(deleteOrder.pending,(state)=>{
            state.loading=true;
            state.error=null;

        })
        .addCase(deleteOrder.fulfilled,(state,action)=>{
            state.loading=false;
            state.success=action.payload.success;
            state.message=action.payload.message;
        })
        .addCase(deleteOrder.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || 'Failed to Deleting order';
            
        })


        //Update order status
        builder.addCase(updateOrderStatus.pending,(state)=>{
            state.loading=true;
            state.error=null;

        })
        .addCase(updateOrderStatus.fulfilled,(state,action)=>{
            state.loading=false;
            state.success=action.payload.success;
            state.order=action.payload.order;
        })
        .addCase(updateOrderStatus.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || 'Failed to Update order Status';
            
        })


         //Fetch Product Reviews
        builder.addCase(fetchProductReviews.pending,(state)=>{
            state.loading=true;
            state.error=null;

        })
        .addCase(fetchProductReviews.fulfilled,(state,action)=>{
            state.loading=false;
            state.reviews=action.payload.reviews;
           
        })
        .addCase(fetchProductReviews.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || 'Failed to Fetch Product Reviews';
            
        })


        //Delete Product Review
        builder.addCase(deleteReview.pending,(state)=>{
            state.loading=true;
            state.error=null;

        })
        .addCase(deleteReview.fulfilled,(state,action)=>{
            state.loading=false;
            state.success=action.payload.success;
            state.message=action.payload.message;
           
        })
        .addCase(deleteReview.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || 'Failed to Delete Product Review';
            
        })


        
    }
})
export const {removeErrors,removeSuccess,clearMessage}=adminSlice.actions;
export default adminSlice.reducer;
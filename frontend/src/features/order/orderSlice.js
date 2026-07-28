import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

//Create Order
export const createOrder=createAsyncThunk('/order/createOrder',async(order,{rejectWithValue})=>{
    try{
        const config={
            headers:{
                'Content-Type':'application/json'
            }
        }
        const {data}=await axios.post('/api/v1/new/order',order,config);
        // console.log('Order Data',data);
        return data;
        
    }
    catch(error){
        return rejectWithValue(error.response?.data || 'Order Creating Failed')
    }
})

//Get User All Orders
export const getAllMyOrders=createAsyncThunk('/order/getAllMyOrders',async(_,{rejectWithValue})=>{
    try{
        const{data}=await axios.get('/api/v1/orders/user');
        // console.log('User All Orders',data);
        return data
    }
    catch(error){
        return rejectWithValue(error.response?.data || 'Failed to Fetch Orders')
    }
})

//Get single order Datails
export const getOrderDetails=createAsyncThunk('/order/getOrderDetails',async(orderId,{rejectWithValue})=>{
    try{
        const{data}=await axios.get(`/api/v1/order/${orderId}`);
        // console.log('User Order Details',data);
        return data
    }
    catch(error){
        return rejectWithValue(error.response?.data || 'Failed to Fetch Order Details')
    }
})

const orderSlice=createSlice({
    name:'order',
    initialState:{
      success:false,
      error:null,
      loading:false,
      orders:[],
      order:{}

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
        builder.addCase(createOrder.pending,(state)=>{
            state.loading=true;
            state.error=null;

        }).addCase(createOrder.fulfilled,(state,action)=>{
            state.loading=false;
            state.order=action.payload.order;
            state.success=action.payload.success
            
        }).addCase(createOrder.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || 'Order Creating failed'
        })

        //Get All user Order
        builder.addCase(getAllMyOrders.pending,(state)=>{
            state.loading=true;
            state.error=null;

        }).addCase(getAllMyOrders.fulfilled,(state,action)=>{
            state.loading=false;
            state.orders=action.payload.orders;
            state.success=action.payload.success
            
        }).addCase(getAllMyOrders.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || 'Failed to Fetch Orders'
        })

        //Get Order Details
        builder.addCase(getOrderDetails.pending,(state)=>{
            state.loading=true;
            state.error=null;

        }).addCase(getOrderDetails.fulfilled,(state,action)=>{
            state.loading=false;
            state.order=action.payload.order;
            state.success=action.payload.success
            
        }).addCase(getOrderDetails.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || 'Failed to Fetch Orders'
        })
    }
})
export const{removeErrors,removeSuccess}=orderSlice.actions;
export default orderSlice.reducer;
import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//Add items to Cart
export const addItemsToCart=createAsyncThunk('cart/additemstocart',async({id,quantity},{rejectWithValue})=>{
    try{
        const {data}=await axios.get(`/api/v1/product/${id}`)
        // console.log('add Items to Cart',data);
        
        return {
            product:data.Product._id,
            name:data.Product.name,
            price:data.Product.price,
            image:data.Product.image[0].url,
            stock:data.Product.stock,
            quantity
        }
        
    }
    catch(error){
        return rejectWithValue(error.response?.data || "An Error Occurred")
    }
})

const cartSlice=createSlice({
    name:'cart',
    initialState:{
        cartItems:JSON.parse(localStorage.getItem('cartItems'))||[],
        error:null,
        success:false,
        message:null,
        loading:false,
        removingId:null,
        shippingInfo:JSON.parse(localStorage.getItem('shippingInfo'))||{} 
    },
    reducers:{
        removeErrors:(state)=>{
          state.error=null
        },
        removeMessage:(state)=>{
            state.message=null
        },
        removeItemFromCart:(state,action)=>{
            state.removingId=action.payload;
            // console.log(state.removingId);
            state.cartItems=state.cartItems.filter(item=>item.product!=action.payload);
            localStorage.setItem('cartItems',JSON.stringify(state.cartItems));
            state.removingId=null
        },
        saveShippingInfo:(state,action)=>{
            state.shippingInfo=action.payload;
            localStorage.setItem('shippingInfo',JSON.stringify(state.shippingInfo))
        },
        clearCart:(state)=>{
            state.cartItems=[];
            localStorage.removeItem('cartItems');
            localStorage.removeItem('shippingInfo');
        }
    },
    extraReducers:(builder)=>{
    //Add Items to Cart

    builder.addCase(addItemsToCart.pending,(state)=>{
        state.loading=true;
        state.error=null;
    })
    .addCase(addItemsToCart.fulfilled,(state,action)=>{
        const item=action.payload;
        // console.log(item);
        const existingItem=state.cartItems.find((i)=>i.product===item.product);
        if(existingItem){
            existingItem.quantity=item.quantity
            state.message=`Updated ${item.name} quantity in the Cart Successfully`
        }
        else{
            state.cartItems.push(item);
            state.message=`${item.name} is  Added to Cart Successfully`
        }
        state.success=true;
        state.error=null;
        state.loading=false;
        localStorage.setItem('cartItems',JSON.stringify(state.cartItems))
    })
    .addCase(addItemsToCart.rejected,(state,action)=>{
        state.loading=false;
        state.error=action.payload?.message || 'An error Occurred'

    })
    }
})

export const{removeErrors,removeMessage,removeItemFromCart,saveShippingInfo,clearCart}=cartSlice.actions;
export default cartSlice.reducer;
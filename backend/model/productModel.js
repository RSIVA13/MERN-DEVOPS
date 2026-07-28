const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Product Name"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"Please Enter Product Description"]
    },
    price:{
        type:Number,
        required:[true,"Please Enter Product Price"],
        MaxLength:[7,"Please cannot exceed 7 Digits"]
    },
    ratings:{
        type:Number,
        default:0
    },
    image:[
        {
            public_id:{
                type:String,
                required:true
            },url:{
                 type:String,
                required:true
            }
        }
    ],
    category:{
        type:String,
        required:[true,"Please Enter Product category"]
    },
    stock:{
        type:Number,
        required:[true,"Please Enter Product Stock"],
         MaxLength:[5,"Please cannot exceed 5 Digits"],
         default:1

    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                required:true
            },
            order:{
                type:mongoose.Schema.ObjectId,
                ref:"Order",
                required:true
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                 type:Number,
                required:true
            },
            comment:{
                 type:String,
                required:true
            }
        }

    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const prodSchema=mongoose.model("Product",productSchema);
module.exports=prodSchema;
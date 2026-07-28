const express=require('express');
const dotenv=require('dotenv');
if (process.env.NODE_ENV !== 'PRODUCTION') {
   dotenv.config({ path: 'backend/.env' });
}
const mongoose=require('mongoose');
const product=require('./routes/productRoutes.js');
const user=require('./routes/userRoutes.js');
const order=require('./routes/orderRoutes.js');
const payment=require('./routes/paymentRoutes.js');
const errorHandleMiddleware=require('./middleware/error.js')
const cookieParser=require('cookie-parser');
const cloudinary = require('cloudinary').v2;
const fileUpload=require('express-fileupload');
const path = require('path');

// console.log(__filename); // full path of this file
// console.log(__dirname); 


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})

const app=express();
const port=process.env.PORT;
const mongo_url=process.env.MONGO_URL;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());

app.use('/api/v1',product);
app.use('/api/v1',user);
app.use('/api/v1',order);
app.use('/api/v1/',payment);
app.use(errorHandleMiddleware);

//server Static file

  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  // Regex version (works in Express 5)
  app.get(/.*/, (_, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
  });





//Handle uncaught exception errors
process.on('uncaughtException',(err)=>{
    console.log(`Error : ${err.message}`);
    console.log('Server is shutting down due to uncaught exception error');
    process.exit(1);
})


mongoose.connect(mongo_url).then(()=>{
    console.log("Mongodb Connected Succesfully")
})



const server=app.listen(port,()=>{
    console.log(`Server Connected in Port ${port}`)
})

// console.log(my); //uncaughtException error


process.on('unhandledRejection',(err)=>{
    console.log(`Error : ${err.message}`);
    console.log(`server is shutting down due to unhandled promise rejection`);
    server.close(()=>{
        process.exit(1)
    })
})





// App-ல் ஏதாவது async error (like DB connection fail) .catch() இல்லாமல் விட்டா,

// App crash ஆகாது... ஆனா hang ஆகும், unstable status-ல இருக்கும்.

// 🎯 With this:
// App crash ஆகாம safe-ஆ shut down ஆகும்.

// Load balancer/hosting environment (ex: Heroku, PM2, Docker) அதை auto-restart பண்ணும்.


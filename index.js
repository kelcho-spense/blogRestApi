const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const postRoute = require('./routes/posts');
const categoryRoute = require('./routes/categories')
const multer = require('multer');
const path = require('path');

dotenv.config();
app.use(express.json()); //app is able to send JSON requests

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(console.log("connected to mongodb"))
.catch((err) =>console.log(err));

//storage to store images
const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,'images');
    },
    filename: (req,file,cb) => {
        cb(null, req.body.name); 
    }
}); 

//upload file
const upload = multer({storage:storage});

//set upload route
app.post('/api/upload', upload.single('file') ,(req,res) =>{
    res.send("File has been Uploaded");
}); 

//define my routes
app.use("/api/auth",authRoute);
app.use("/api/users",userRoute);
app.use("/api/posts",postRoute);
app.use("/api/categories",categoryRoute);

app.listen("5000",() => {
    console.log('Server running');
});
// initializing the server
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();
// middlewares
app.use(cors());
app.use(express.json());

// initial route for testing
app.get('/',(req,res)=>{
    res.send('server is running...');
});

// Listening the from
app.listen(port,()=>{
    console.log(`server is running on port ${port}` )
})
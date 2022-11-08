// initializing the server
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
// middlewares
app.use(cors());
app.use(express.json());

// initial route for testing
app.get('/',(req,res)=>{
    res.send('server is running...');
});
// connecting to the mongo db

const uri = "mongodb+srv://assignment-11-DB:ZO13y6nybu8cVHZN@cluster0.ugpmzsn.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        const dataBase = client.db('assignment-11-DB').collection('services');
        const addComments = client.db('assignment-11-DB').collection('comments')
        // getting limited data from the database 
        app.get('/servicespart',async(req,res)=>{
            const query = {};
            const cursor = dataBase.find(query).limit(3);
            const services = await cursor.toArray()
            res.send(services)
        })
        // getting all data from the database
        app.get('/services',async(req,res)=>{
            const query = {};
            const cursor = dataBase.find(query);
            const services = await cursor.toArray()
            res.send(services)
        })
        app.get('/services/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const service = await dataBase.findOne(query);
            res.send(service)
        })
        // post comment api
        app.post('/comments', async(req,res)=>{
            const userComments = req.body;
            const comment =await addComments.insertOne(userComments)
            res.send(comment)
        })
        // getting comments
        app.get('/comments',async(req,res)=>{
            // console.log(req.query)
            let query = {};
            if(req.query.email){
                query ={
                    email : req.query.email
                }
            }
            const cursor = addComments.find(query);
            const comments = await cursor.toArray();
            res.send(comments)
        })
    }
    finally{

    }

}
run().catch(err => {
    console.log(err)
})
// Listening the from
app.listen(port,()=>{
    console.log(`server is running on port ${port}` )
})

// assignment-11-DB ZO13y6nybu8cVHZN
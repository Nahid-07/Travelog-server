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
const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@cluster0.ugpmzsn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        const dataBase = client.db('assignment-11-DB').collection('services');
        const addComments = client.db('assignment-11-DB').collection('comments')

        //  JWT TOKEN 
        app.post('/jwt',(req,res)=>{
            const user = req.body;
            const token = jwt.sign(user,process.env.ACCESS_TOKEN,{expiresIn:'1h'})
            res.send({token})
        })
        // getting limited data from the database 
        app.get('/servicespart',async(req,res)=>{
            const query = {};
            const cursor = dataBase.find(query).sort({time:-1}).limit(3);
            const services = await cursor.toArray()
            res.send(services)
        })
        // getting all data from the database
        app.get('/services',async(req,res)=>{
            const query = {};
            const cursor = dataBase.find(query).sort({time : -1});
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
            let query = {};
            if(req.query.email){
                query ={
                    email : req.query.email
                }
            }
            const cursor = addComments.find(query);
            const comments = await cursor.toArray();
            res.send(comments)
        });
        app.get('/comments/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id : ObjectId(id)}
            const comment = await addComments.findOne(query)
            res.send(comment)
        })
        app.delete('/comments/:id', async(req,res)=>{
            const id = req.params.id;
            // console.log(id)
            const query = {_id : ObjectId(id)};
            const result = await addComments.deleteOne(query);
            res.send(result)
        })
        // add post api 
        app.post('/services', async(req,res)=>{
            const service = req.body;
            const addService = await dataBase.insertOne(service);
            res.send(addService)
        })
        // update a user comments
        app.put('/comments/:id',async(req,res)=>{
            const id = req.params.id;
            const updateComment =req.body;
            const filter = {_id : ObjectId(id)};
            const updated={
                $set:{
                    message : updateComment.message
                }
            }
            const result = await addComments.updateOne(filter,updated);
            res.send(result)
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
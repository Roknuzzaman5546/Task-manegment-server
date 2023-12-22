const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;


// middleware 
app.use(cors({
    origin: ['http://localhost:5173']
}));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m8ywqwd.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const taskCollection = client.db("TaskDb").collection("task");

        app.post('/task', async (req, res) => {
            const item = req.body;
            const result = await taskCollection.insertOne(item)
            res.send(result)
        })

        app.get('/task', async (req, res) => {
            const result = await taskCollection.find().toArray()
            res.send(result)
        })

        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await taskCollection.deleteOne(query)
            res.send(result)
        })

        app.put('/task/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const taskUpdate = req.body;
            const updateproducts = {
                $set: {
                    status: taskUpdate.status,
                }
            }
            const result = await taskCollection.updateOne(filter, updateproducts, options)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Task managment clint is running')
})

app.listen(port, () => {
    console.log(`Task managment pport is ruuning out ${port}`)
})
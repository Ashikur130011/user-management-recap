const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json())

//user-management
//1xRerFT2xtukl8yZ



const uri = "mongodb+srv://user-management:1xRerFT2xtukl8yZ@cluster0.yxk5a5e.mongodb.net/?appName=Cluster0";

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

    const userCollection = client.db('userManagementDB').collection('user')

    //create User
    app.post('/user', async(req, res) => {
        const user = req.body
        console.log(user)
        const result = await userCollection.insertOne(user)
        res.send(result)

    })

    //get data
    app.get('/user', async(req, res) => {
        const cursor = userCollection.find()
        const result = await cursor.toArray(cursor)
        res.send(result)
    })

    //delete user
    app.delete('/user/:id', async(req, res) => {
        const id = req.params.id
        const query = {_id: new ObjectId(id)}
        const result = await userCollection.deleteOne(query)
        res.send(result)
    })

    //Update User
    app.patch('/user', async(req, res) => {
        const user = req.body
        const filter = {email: user.email}
        const updateDoc = {
            $set:{
                lastLoggedat : user.lastLoggerAt
            }
        }
        const result = await userCollection.updateOne(filter, updateDoc)
        res.send(result)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('User Management Server is running')
})

app.listen(port, () => {
    console.log(`Management server in running on port: ${port}`)
})
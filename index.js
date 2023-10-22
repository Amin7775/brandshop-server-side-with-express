const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

app.get('/', (req,res)=>{
    res.send("Brand Shop Server Is Running");
})

//db


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x4cetjc.mongodb.net/?retryWrites=true&w=majority`;

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

    const database = client.db("BrandShop")
    const brandCollection = database.collection("Brands")
    const productCollection = database.collection("Products")

    //get route from db to fetch brands on homepage
    app.get('/brand', async(req,res)=>{
        const cursor = brandCollection.find()
        const result = await cursor.toArray();
        res.send(result)
      })

    //Add Products section - start
    //post
    app.post('/products', async(req,res)=>{
      const newProduct = req.body;
      // console.log(newProduct)
      const result = await productCollection.insertOne(newProduct)
      res.send(result)
    })

    //get
    app.get('/products', async(req,res)=>{
      const cursor = productCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    //Add Products section - end

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port,()=>{
    console.log(`Brand Shop Server is Running on Port: ${port}`);
})
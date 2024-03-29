const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    // await client.connect();

    const database = client.db("BrandShop")
    const brandCollection = database.collection("Brands")
    const productCollection = database.collection("Products")
    const cartCollection = database.collection("Cart")

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

    //view single product from db
    app.get('/products/:id',async(req,res)=> {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await productCollection.findOne(query);
      res.send(result)
    })

    //Update Products -- Post Method
    app.put('/products/:id', async(req,res)=>{
      const id= req.params.id;
      const product = req.body;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert : true}
      const updatedProducts = {
        $set:{
            name:product.name,
            brand:product.brand,
            price:product.price,
            type:product.type,
            image:product.image,
            rating:product.rating,
            short_description:product.short_description
        }
      }

      const result = await productCollection.updateOne(filter,updatedProducts,options)

      res.send(result)
    })

    //Add to cart route 
    //get data from web (post)
    app.post('/cart', async(req,res)=>{
      const loadedAddToCart = req.body;
      const result = await cartCollection.insertOne(loadedAddToCart)
      res.send(result)
    })
    //read data on backend route(get)
    app.get('/cart', async (req,res)=>{
      const cursor = cartCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    //load single cart data
    app.get('/cart/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await cartCollection.findOne(query);
      res.send(result)
    })
    //delete cart data
    app.delete('/cart/:id', async(req,res)=>{
      const id = req.params.id;
       const query = {_id: new ObjectId(id)}
       const result = await cartCollection.deleteOne(query);
       res.send(result)
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
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
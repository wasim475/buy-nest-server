const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000

// Middle-ware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.buyNowDB}:${process.env.dbPass}@cluster0.uc340vx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

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
    const productsCollection = client.db('productDB').collection('products')


    app.get('/products', async(req, res) => {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const sortBy = req.query.sortBy || 'createdAt';  
      const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;  
  
      const skip = (page - 1) * limit;
  
      const cursor = productsCollection.find().sort({ [sortBy]: sortOrder }).skip(skip).limit(limit);
      const result = await cursor.toArray();
      const totalProducts = await productsCollection.countDocuments();
  
      res.send({
          totalProducts,
          page,
          limit,
          products: result
      });
  });
  
   
    console.log("Pinged Your deployment. You  Successfully Connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Buy Nest Server is running on ${port}`)
})
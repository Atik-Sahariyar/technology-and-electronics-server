const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5700;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// Middlewere
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m4j1j7e.mongodb.net/?retryWrites=true&w=majority`;

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

    const productCollections = client.db('productsDB').collection('products');
    
    app.get('/products', async(req, res) => {
        const cursor = productCollections.find();
        const result = await cursor.toArray();
        res.send(result);
        console.log(result);
    })
     
    // get indevidual product
    app.get('/products/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await productCollections.findOne(query);
      res.send(result);
    })
   

    app.post('/products', async(req, res) => {
        const newProduct = req.body;
        console.log(newProduct);
        const result = await productCollections.insertOne(newProduct);
        res.send(result);
    })
    // update productc

    app.put('/products/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updatedProduct = req.body;

      const product = {
          $set: {
              name: updatedProduct.name, 
              quantity: updatedProduct.quantity, 
              supplier: updatedProduct.supplier, 
              taste: updatedProduct.taste, 
              category: updatedProduct.category, 
              details: updatedProduct.details, 
              photo: updatedProduct.photo
          }
      }

      const result = await productCollections.updateOne(filter, product, options);
      res.send(result);
  })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your d eployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res ) => {
    res.send('Technology and electronics server is running')
})

app.listen(port, () => {
    console.log(`Technology and electronics server is running on port: ${port}`);
})
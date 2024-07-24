const express=require('express'); //import express package.
const app=express();           //called express function 
const port=process.env.PORT || 5000;
const cors=require('cors');     //importing cors package.

//middleware
app.use(cors());
app.use(express.json());  //This middleware is used to create connection between frontend and backend.



app.get('/',(req,res) =>{
    res.send("Hello World");
})                              //get api created.


//mongoDB Configurations


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://mern-book-store:bZoW5tGVOvGVQLt3@cluster0.z2rjqzg.mongodb.net/?retryWrites=true&w=majority";

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

    //creating collection of documents
    const bookCollections=client.db("BookInventory").collection("books"); 
    //DB name:-"BookInventory" and TableName:- "books" 


    // To insert book in DB
    app.post("/upload-book",async(req,res) => {
        const data=req.body;
        const result=await bookCollections.insertOne(data);
        res.send(result);
    })

    // Get all books from database.
    app.get("/all-books",async(req,res) =>{
        const books= bookCollections.find();  //find() method for get all data of books.
        const result=await books.toArray();
        res.send(result);
    })

    //update a book data using patch or update method.
    app.patch("/book/:id",async(req,res) =>{
        const id=req.params.id;  //here we get id from request parameter
        // console.log(id);
        const updateBookData=req.body;
        const filter={_id: new ObjectId(id)}
        const options={upsert:true};

        const updateDoc={
            $set:{
                ...updateBookData
            }

          }

        //To update
        const result=await bookCollections.updateOne(filter,updateDoc,options);
        res.send(result)
    })

    //delete a book data
    app.delete("/book/:id",async(req,res) =>{
         const id=req.params.id;
         const filter= {_id:new ObjectId(id)};  
         //Assuming you are working with MongoDB and using the official MongoDB Node.js driver, this line creates a filter object to match the _id field in MongoDB. It uses new ObjectId(id) to convert the id parameter to a MongoDB ObjectId. This is necessary because MongoDB stores _id values as ObjectId.
         const result=await bookCollections.deleteOne(filter)
         res.send(result)
    })

    //find by category
    app.get("/all-books",async(req,res) =>{
        let query={};
        if(req.query?.category){
            query={category: req.query.category}
        }
        
        const result=await bookCollections.find(query).toArray();
        console.log("Result:- "+result);
        res.send(result);

    })

    //To get single book data
    app.get("/book/:id",async(req,res) =>{
      const id=req.params.id;
      const filter={_id:new ObjectId(id)};
      const result=await bookCollections.findOne(filter);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
  
    
  finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () =>{
    console.log(`Example app listening on port ${port}`);
})



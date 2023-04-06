const express = require("express")
const cors = require("cors")
require("dotenv").config()

const app = express()
const Port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3zfz5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const todoCollection = client.db("ProductManager").collection("todo");

        app.post('/todo', async (req, res) => {
            const data = req.body
            const result = await todoCollection.insertOne(data)
            res.send(result)
        })
        app.get('/todo', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const result = await todoCollection.find(query).toArray()
            return res.send(result)

        })
        app.delete("/todo/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await todoCollection.deleteOne(query)
            res.send(result)
        })
        app.patch('/todo/:id', async (req, res) => {
            const id = req.params.id
            const title = req.body.title
            const description = req.body.description
            const date = req.body.date
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    title: title,
                    description: description,
                    date: date
                },

            };
            const result = await todoCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })


    } finally {

    }

}
run().catch(console.dir)




app.get('/', (req, res) => {
    res.send("Todo Sever Running")
})

app.listen(Port, () => { console.log('listening', Port) })
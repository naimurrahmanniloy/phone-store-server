const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config()

//middle wares
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.oah4mk6.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const categoryCollection = client.db('phoneStore').collection('category');
        const usersCollection = client.db('phoneStore').collection('users');

        app.get('/category', async (req, res) => {
            const query = {}
            const result = categoryCollection.find(query);
            const category = await result.toArray();
            res.send(category)
        });

        //for user query
        app.get('/users', async (req, res) => {
            const query = {};
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        });

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });
    }

    finally {

    }
}

run().catch(err => console.log(err))


app.get('/', (req, res) => {
    res.send('Phone store is running')
})

app.listen(port, () => {
    console.log(`Phone Store server is running on ${port}`)
})
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

        app.get('/category', async (req, res) => {
            const query = {}
            const result = categoryCollection.find(query);
            const category = await result.toArray();
            res.send(category)
        })
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
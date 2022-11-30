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
        const sellPostCollection = client.db('phoneStore').collection('sellpost');
        const allPhoneCollection = client.db('phoneStore').collection('allPhones');
        const bookingCollection = client.db('phoneStore').collection('bookings');


        app.get('/category', async (req, res) => {
            const query = {}
            const result = categoryCollection.find(query);
            const category = await result.toArray();
            res.send(category)
        });

        app.get('/allPhones', async (req, res) => {
            const query = {}
            const phone = allPhoneCollection.find(query);
            const result = await phone.toArray();
            res.send(result)
        })

        app.get('/allPhones/:id', async (req, res) => {
            const id = req.params.category;
            console.log(id)
            const query = { category: id }
            const phone = await allPhoneCollection.findOne(query);
            res.send(phone)
        })
        app.get('/category/:category', async (req, res) => {
            const id = req.params.category;
            const query = { category: id };
            const category = await allPhoneCollection.find(query).toArray();
            res.send(category)
        });
        //Posting the information for booking
        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.send(result);
        });

        //admin 
        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        });

        //for user 
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
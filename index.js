const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const jsonwebtoken = require('jsonwebtoken');
require("dotenv").config()


//middle wares
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.oah4mk6.mongodb.net/?retryWrites=true&w=majority`;

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.send(401).send('Unauthorized Access')
    }
    const token = authHeader.split(' ')[1]
}

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const categoryCollection = client.db('phoneStore').collection('category');
        const usersCollection = client.db('phoneStore').collection('users');
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
        //sell post
        app.post('/allPhones', async (req, res) => {
            const allPhones = req.body;
            const result = await allPhoneCollection.insertOne(allPhones);
            res.send(result);
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


        app.get('/bookings', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const bookings = await bookingCollection.find(query).toArray()
            res.send(bookings)
        })

        //admin 
        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        });

        //seller

        app.get('/users/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isSeller: user?.role === 'seller' });
        });

        //jwt token issue

        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' })
                console.log(token)
                return res.send({ accessToken: token });
            }
            res.status(403).send({ accessToken: '' })
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
        app.get('/users/seller', async (req, res) => {
            const query = { role: "seller" };
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        });
        app.get('/users/buyer', async (req, res) => {
            const query = { role: "buyer" };
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        });

        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        });
        app.get('/users/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isSeller: user?.role === 'seller' });
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
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//middlewares
app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Phone store is running')
})

app.listenerCount(port, () => {
    console.log(`Phone Store server is running on ${port}`)
})
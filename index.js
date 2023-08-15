const express = require('express');
const app = express();
const port = 3000;

app.get('/', async (req, res) => {
    res.send('She belong to the streets');
});

app.listen(port, ()=>{
    console.log(`Example port listening on port ${port}`)
});



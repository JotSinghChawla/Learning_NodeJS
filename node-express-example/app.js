const express = require('express');
const port = 3000;
const hostname = 'localhost';

var app = express();

app.use(express.static('public'));

app.get('/product.json', (req, res) => {
    console.log(req, res);
    res.end(req);
})

app.listen(port, hostname, () => {
  console.log(`Our Server is running at http://${hostname}:${port}`);
})

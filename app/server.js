'use strict';
const express = require('express');

// Constants
const PORT = 7000;


// App
const app = express();
app.get('/devops', (req, res) => {
  res.send('Hello World');
});

app.get('/', (req, res) => {
    res.send('Hello World Default Route');
  });

app.get("/devops/new", (req, res) => {
    res.send("welcome to new page");
  });


app.listen(PORT);
console.log(`Running Sample NodeJS App`);

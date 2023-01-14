const express = require('express')
const app = express()
const fs = require('fs')
var JSONStream = require('JSONStream');
const csv = require( 'csv-parser');
const { connection } = require('./connectDb');

//use stream
app.get('/src', function (req, res) {

  const stream = fs.createReadStream('./Unidades_Basicas_Saude-UBS.csv')
  stream.pipe(csv({ separator: ';' }))
    .pipe(JSONStream.stringify())
    .pipe(res) 
})

//use stream
app.get('/db', function (req, res) {
  const stream = connection
  .select(connection.raw('* FROM ubs;'))
  
  res.set('Content-Type', 'application/json');
  stream.stream().pipe(JSONStream.stringify()).pipe(res);
})

app.use('/memory', async function (req, res) {
  fs.readFile('./Unidades_Basicas_Saude-UBS.csv', (err, data) => {
    if (err) throw err;

    res.end(data);
  });
})
app.listen(3000)


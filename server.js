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

// stream's video
app.get('/video', (req, res) => {
  //caminho do video
  const file = `./video.mp4`;
  fs.stat(file, (err, stats) => {
    if (err) {
      console.log(err);
      return res.status(404).end('<h1>Video Not found</h1>');
    }
    // Variáveis necessárias para montar o chunk header corretamente
    const { range } = req.headers;
    const { size } = stats;
    const start = Number((range || '').replace(/bytes=/, '').split('-')[0]);
    const end = size - 1;
    const chunkSize = (end - start) + 1;
    // Definindo headers de chunk
    res.set({
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4'
    });
    // É importante usar status 206 - Partial Content para o streaming funcionar
    res.status(206);
    // Utilizando ReadStream do Node.js
    // Ele vai ler um arquivo e enviá-lo em partes via stream.pipe()
    const stream = fs.createReadStream(file, { start, end });
    stream.on('open', () => stream.pipe(res));
    stream.on('error', (streamErr) => res.end(streamErr));
  });
});

app.listen(3000)


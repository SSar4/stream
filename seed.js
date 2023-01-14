const fs = require( 'fs')
const csv = require( 'csv-parser')
const { Writable, Transform } = require( 'stream')
const { connection } = require('./connectDb');


const readableStreamFile = fs.createReadStream('./Unidades_Basicas_Saude-UBS.csv')
const transformToString = new Transform({
  objectMode: true,
  transform(chunk, _encoding, callback) {
    callback(null, JSON.stringify(chunk))
  },
})
const writableStreamFile = new Writable({
   async write(chunk, _encoding, next) {
    const stringifyer = chunk.toString()
    const rowData = JSON.parse(stringifyer)
    await connection('ubs').insert(rowData);
     next()
  },
})


readableStreamFile
  .pipe(csv({ separator: ';' }))
  .pipe(transformToString)
  .pipe(writableStreamFile)
  .on('close', () => console.log('Finalizou'))
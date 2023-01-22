const fs = require( 'fs')
const csv = require( 'csv-parser')
const { Writable, Transform } = require( 'stream')
const { connection } = require('./connectDb');

const insert = async (rowData) => {
  await connection('ubs').insert(rowData);
}
const readableStreamFile = fs.createReadStream('./Unidades_Basicas_Saude-UBS.csv')
const transformToString = new Transform({
  objectMode: true,
  transform(chunk, _encoding, callback) {
    callback(null, JSON.stringify(chunk))
  },
})
const writableStreamFile = new Writable({
  write(chunk, _encoding, next) {
    const stringifyer = chunk.toString()
    const rowData = JSON.parse(stringifyer)
    insert(rowData).then(()=>next())
  },
})


readableStreamFile
  .pipe(csv({ separator: ';' }))
  .pipe(transformToString)
  .pipe(writableStreamFile)
  .on('close', () => console.log('Finalizou'))
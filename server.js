const express =  require('express');
const app = express();

const {MongoClient} = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');

app.use(express.static(__dirname));

app.use(async (req, res, next) => {
    await client.connect();
    req.db = client.db('commentNotes');

    next();
});

app.get('/:fileName', async  (req, res, next) => {
    const fileName = req.params.fileName;
    const fileInfo = await req.db.collection('files').findOne({name: fileName});

    res.status(200).send(fileInfo);
});

app.get('/', async (req, res, next) => {
    res.sendFile(__dirname + '/main.html');
});

app.listen(5500, () => {
    console.log('server started');
});

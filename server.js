const express =  require('express');
const app = express();

const {MongoClient, ObjectID} = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');

const bodyParser = require('body-parser');

app.use(express.static(__dirname));
app.use(bodyParser.json());

app.use(async (req, res, next) => {
    await client.connect();
    req.db = client.db('commentNotes');

    next();
});

app.post('/saveFile', async (req, res, next) => {
    const info = req.body;

    const strings = info.strings.map((elem, index) => {
        return {
            content: elem, 
            comment: (info.comments[index]) ? info.comments[index] : ''
        }
    });

    if (!info.id) {
        req.db.collection('files').insertOne({
            name: info.fileName,
            strings,
        });
    } else {
        req.db.collection('files').updateOne({_id: new ObjectID(info.id)}, {
            $set: {
                name: info.fileName,
                strings,
            }
        });
    }

    res.status(200).send({message: 'Данные записаны', type: 'success'});
});

app.post('/delete', async (req, res, next) => {
    const fileName = req.body.fileName; 
    
    req.db.collection('files').deleteOne({
        name: fileName,
    });

    res.status(200).send({message: 'Удалено', type: 'success'});
});

app.get('/file/:fileName', async  (req, res, next) => {
    const fileName = req.params.fileName;
    const fileInfo = await req.db.collection('files').findOne({name: fileName});

    res.status(200).send(fileInfo);
});

app.get('/allFiles', async (req, res, next) => {
    const files = await req.db.collection('files').find({}, {projection: {_id: 0, name: 1}}).toArray();
    res.status(200).send(files);
});

app.get('/', async (req, res, next) => {
    res.sendFile(__dirname + '/main.html');
});

app.listen(5500, () => {
    console.log('server started');
});

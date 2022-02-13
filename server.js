const express =  require('express');
const app = express();

app.use(express.static('./'));

app.get('/', async (req, res, next) => {
    res.sendFile('index.html');
});

app.listen(5500, () => {
    console.log('server started');
})
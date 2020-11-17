'use strict'

require('dotenv').config();
const
    express = require('express'),
    superagent = require('superagent'),
    PORT = process.env.PORT,
    DATABASE_URL = process.env.DATABASE_URL,
    pg = require('pg'),
    client = new pg.Client(DATABASE_URL),
    override = require('method-override'),
    app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(override('_method'));
app.use(express.urlencoded({ extended: true }));

//.............................................................

app.get('/home', getHome);
app.post('/fav', handleFav);
app.get('/fav', handlfav1)
app.get('/details/:id', details);
app.put('/details/:id', handleupdate)
app.delete('/details/:id', handledelete);
//.............................................................

function getHome(req, res) {
    let url = `https://official-joke-api.appspot.com/jokes/programming/ten`;
    superagent.get(url).then(data => {
        let arr = data.body.map(val => {
            return new joke(val);
        })
        res.render('pages/index', { result: arr })
    })

}
//.............................................................

function handleFav(req, res) {

    const { type, setup, punchline } = req.body;
    const sqlInsert = 'insert into jokes (type,setup,punchline) values ($1,$2,$3);'
    const safeValue = [type, setup, punchline]
    client.query(sqlInsert, safeValue).then(() => res.redirect('/fav'))

}
//.............................................................

function handlfav1(req, res) {

    const sqlGet = 'select * from jokes;'
    client.query(sqlGet).then(data => {
        res.render('pages/fav', { result: data.rows })
    })
}
//.............................................................

function details(req, res) {
    const sql = 'select * from jokes where id=$1;'
    let val = [req.params.id];
    client.query(sql, val).then(data => {
        res.render('pages/details', { result: data.rows })
    })
}
//.............................................................
function handleupdate(req, res) {
    let sql = `update jokes set type=$1, setup=$2, punchline=$3 where id=$4;`;
    let val = [req.body.type, req.body.setup, req.body.punchline, req.params.id];
    client.query(sql, val).then(() => res.redirect(`/fav`))
}
//.............................................................
function handledelete(req, res) {
    let sql = `delete from jokes where id=$1;`;
    let val = [req.params.id];
    client.query(sql, val).then(() => res.redirect('/fav'))
}
//.............................................................

function joke(val) {
    this.type = val.type;
    this.setup = val.setup;
    this.punchline = val.punchline;
}

//.............................................................
client.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`connected to ${PORT}`);
    })
}).catch(err => console.log('error connection .. ', err))
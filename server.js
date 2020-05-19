////////////   Modules  /////////////
const express = require('express');
const app = express();
const port = 8080;
const morgan = require('morgan');
const bodyParser = require('body-parser');
const axios = require('axios');

////////////   Middleware /////////////
app.set('view engine', 'ejs');
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(express.static('public'));


////////////   Routes  /////////////
app.get('/', (req, res) => {
    res.render('welcome_page')
})


app.get('/index', (req, res) => {
    res.render('index')
})

// MediaWiki API
app.get('/api/mediawiki', (req, res) => {
    let url = "https://en.wikipedia.org/w/api.php"; 

    const params = {
        action: "query",
        generator: "geosearch",
        prop: "coordinates|pageimages",
        ggscoord: "-37.8267882|144.9559848",
        format: "json"
    };

    url = url + "?origin=*";
    Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

    axios.get(url).then((apiRes) => {
        res.json(apiRes.data);
    })
})





////////////   SERVER LISTENNING  /////////////
app.listen(port, () => {
    console.log(`listening to port ${port}`);
})
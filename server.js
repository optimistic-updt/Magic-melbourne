////////////   Modules  /////////////
const express = require('express');
const app = express();
const port = 8080;
const morgan = require('morgan');
const bodyParser = require('body-parser');
const axios = require('axios');
const geoJSON = require('./library/geoJSON_module');

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
    // wikipedia url
    let url2 = "https://en.wikipedia.org/w/api.php"; 

    // wikivoyage url
    let url = "https://wikitravel.org/wiki/en/api.php";

    // search nearby places by coordinates
    const params2 = {
        action: "query",
        generator: "geosearch",
        prop: "coordinates|pageimages",
        ggscoord: "-37.8267882|144.9559848",
        format: "json"
    };

    // search page by text
    const params = {
        action: "opensearch",
        search: "melbourne",
        limit: "20",
        namespace: "0",
        format: "json"
    };

    url = url + "?origin=*";
    Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

    axios.get(url).then((apiRes) => {
        res.json(apiRes.data);
    })
})

// geoJSON output
app.get('/api/geojson', (req, res) => {
    res.json(geoJSON.displayPOI());
})



////////////   SERVER LISTENNING  /////////////
app.listen(port, () => {
    console.log(`listening to port ${port}`);
})
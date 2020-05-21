////////////   Modules  /////////////
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const morgan = require('morgan');
const bodyParser = require('body-parser');
const axios = require('axios');
const geoJSON = require('./library/geoJSON_module');
const session = require('express-session');
const { v4: genuuid } = require('uuid');
const indexRouter = require('./routes/index')
const attractionsRouter = require('./routes/attractions')
let inputForFinalPage = []


////////////   Middleware /////////////
app.set('view engine', 'ejs');
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(express.static('public'));

////////////   routing /////////////
// app.use('/', indexRouter)
// app.use('/attractions', attractionsRouter)




////////////  Session setup  /////////////
app.use(session({
  name: 'SessionCookie',
  genid: function (req) {
    console.log('session id created')
    return genuuid() // use UUIDs for session IDs
  },
  secret: 'tom cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 }
}))

var sess;
////////////   Routes  /////////////
app.get('/', (req, res) => {
  sess = req.session;
  sess.starredItems = [];
  inputForFinalPage = []
  res.render('welcome_page', {
    currentUserId: sess.id,
    starredItems: sess.starredItems
  })
})


app.get('/index', (req, res) => {
  sess = req.session;
  
  let url = `https://api.sygictravelapi.com/1.2/en/places/list?parents=city:381&categories=${req.query.category}&limit=20`

  axios.get(url, {
    headers: {
      'x-api-key': 'BNLiHyXDsUa1OhdwsHho47y6rO0HKcNa5BWnofl7'
    }
  }).then(response => {

    // res.json(response.data)

    // clean up the date to provide us the relevant information
    let arrOfPlaces = response.data.data.places
    let arrOfInstances = []

    arrOfPlaces.forEach(place => {
      let instancePlace = { id: place.id, name: place.name, location: place.location, description: place.perex, image: place.thumbnail_url }
      arrOfInstances.push(instancePlace)
    })

    sess.starredItems.push('poi:23432');
    sess.apiResults = response.data;

    res.render('index', {
      attractions: arrOfInstances,
      currentUserId: sess.id,
      starredItems: sess.starredItems,
      apiResults: sess.apiResults
    })
  })
})

app.get('/itinerary', (req, res) => {
  // res.send('Hello')
  res.render('itinerary',{selectedLocs: inputForFinalPage})
  // res.render('itinerary')
})

app.post('/attractions', (req, res) => {
  sess = req.session
  console.log(req.body.idArr)

  //this is Kevin experiment, I managed to retrieve the attraction object under req.body.attraction
  //the problem is that the array keeps on re-initialese....
  // console.log('Made It');
  // console.log(req.body.attraction);
  // sess.attractions = []
  inputForFinalPage.push(req.body.attraction)
  console.log(inputForFinalPage)
  // sess.attractions.push(req.body.attraction)
  // console.log(sess.attractions);
})

// geoJSON output
app.get('/api/geojson', (req, res) => {
  sess = req.session;
  res.json(geoJSON.convertToGeoJSON(sess.apiResults));
})

////////////   SERVER LISTENNING  /////////////
app.listen(port, () => {
  console.log(`listening to port ${port}`);
})
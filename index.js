const express = require('express')
const app = express()
const port = 3000
var request = require('request');
var multer = require('multer');
var upload = multer();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(upload.array());

let mData=""
let coinName = "bitcoin"
let mChart = ""

async function resData(coinName) {
  var marketData = await new Promise((resolve,reject) =>{
    request('https://api.coingecko.com/api/v3/coins/'+ coinName, function (response, body) {
      console.log('statusCode:', response && response.statusCode);
      console.log('body:', typeof body);
      mData = JSON.parse(body);
    resolve(mData)
    });
  })

  if(marketData) {
    var marketChart = await new Promise((resolve,reject) =>{
      request('https://api.coingecko.com/api/v3/coins/'+coinName +'/market_chart?vs_currency=usd&days=10', function (response, body) {
        console.log('statusCode:', response && response.statusCode);
        console.log('body:', typeof body);
        mChart = JSON.parse(body)
      resolve(mData)
    });
    })
  }
}

app.get('/', async(req, res) => {
  await resData(coinName)
  res.render('index',{mData,mChart})
})

app.post('/', async(req,res) => {
  coinName = req.body.selectCoin;
  await resData(coinName)
  res.render('index',{mData,mChart})
})

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})

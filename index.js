const express = require('express');
const axios = require('axios');
const moment = require('moment');
const path = require('path');
const getFBData = require('./utils/fbDataUtils')

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// ******************** Page class ********************
// Test page information: 
// name: Thai Unika
// ID: 1372050359482095
// Token: EAAC5t88o6eEBAI0wCeidZCSg751DG32p5iWxKOBuEN6M1bDPkpphDvivLfdlRc4BQOFEgYCeNZAhGqtZBfzXZCWPJT0PZCOZB3B19Jpex8IprczeTTwcwsRPrFwfZCaFhCZByt15GtQSapWxWsWAzZAnUfnGjGBIzRBFqGDjBaMrR5f5hlQE6sZAZBn
class Page {
  constructor(name, ID, pageToken, datePreset, target) {
    this.name = name;
    this.ID = ID;
    this.accessToken = pageToken;
    this.datePreset = datePreset;
    this.pageData = null;
    this.targetData = target;
  }

  async init() {
    const data = await getFBData(this.ID, this.accessToken, this.datePreset);
    this.pageData = data;
  }

  async display() {
    await this.init();
    console.log(this.name);
    console.log(this.ID);
    console.log(this.accessToken);
    console.log(this.pageData);
    console.log(this.targetData);
  }
}

const englishTarget = {reachTarget: 150000, engagementsTarget: 15000, pageLikesTarget: 70};
const nonEnglishTarget = {reachTarget: 100000, engagementsTarget: 10000, pageLikesTarget: 50};

// ******************** Server route handling ********************
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/graph.html', (req,res) => {
  res.sendFile(path.join(__dirname, 'public/graph.html'));
})

app.get('/index.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/data', (req, res) => {
  var name = req.query.name;
  var pageID = req.query.page_id;
  var pageToken = req.query.page_token;
  var datePreset = req.query.date_preset;
  var target = req.query.target;
  if (target == 1){target = englishTarget;}
  else if (target == 2){target = nonEnglishTarget;}
  try {
    let myPage = new Page(name, pageID, pageToken, datePreset, target);
    myPage.init().then(() => {
      var {date, reach, engagements, pageLikes} = myPage.pageData ;
      var {reachTarget, engagementsTarget, pageLikesTarget} = myPage.targetData;
      res.redirect('/graph.html?name=' + encodeURIComponent(name)
      + "&date=" + encodeURIComponent(date)
      + "&reach=" + encodeURIComponent(reach)
      + "&engagements=" + encodeURIComponent(engagements)
      + "&pageLikes=" + encodeURIComponent(pageLikes)
      + "&reachTarget=" + encodeURIComponent(reachTarget)
      + "&engagementsTarget=" + encodeURIComponent(engagementsTarget)
      + "&pageLikesTarget=" + encodeURIComponent(pageLikesTarget)
      );
    });
  } catch (err) {
    res.status(404).send("Internal server error:" + err.message);
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});



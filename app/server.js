let express = require('express');
let path = require('path');
let fs = require('fs');
let MongoClient = require('mongodb').MongoClient;
let bodyParser = require('body-parser');

let app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/profile-picture', function (req, res) {
  let stream = fs.createReadStream(path.join(__dirname, 'images/profile-1.jpg'));
  stream.on('open', function () {
    res.set('Content-Type', 'image/jpg');
    stream.pipe(res);
  });
  stream.on('error', function () {
    res.sendStatus(404);
  });
});

let mongoUrl = process.env.MONGO_URL || 'mongodb://admin:password@localhost:27017';
let databaseName = process.env.MONGO_DB || 'my-db';

app.post('/update-profile', function (req, res) {
  let userObj = req.body;
  userObj['userid'] = 1;

  MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
    if (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }

    let db = client.db(databaseName);
    let myquery = { userid: 1 };
    let newvalues = { $set: userObj };
    db.collection('users').updateOne(myquery, newvalues, { upsert: true }, function (err, result) {
      if (err) {
        console.error(err);
        res.sendStatus(500);
        return;
      }
      client.close();
      res.send(userObj);
    });
  });
});

app.get('/get-profile', function (req, res) {
  MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
    if (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }

    let db = client.db(databaseName);
    let myquery = { userid: 1 };
    db.collection('users').findOne(myquery, function (err, result) {
      if (err) {
        console.error(err);
        res.sendStatus(500);
        return;
      }
      client.close();
      res.send(result || {});
    });
  });
});

app.listen(3000, function () {
  console.log('app listening on port 3000!');
});

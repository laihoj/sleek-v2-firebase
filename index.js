if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express       = require("express");
const bodyParser = require('body-parser');
const app           = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended:true}));


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");  
  next();
})


const admin         = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert({
    "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "project_id": process.env.PROJECT_ID,
  }),
  databaseURL: process.env.DATABASE_URL,
});

var db = admin.database();

const node_ref = db.ref("node");
const recordings_ref = db.ref("recordings");
const devices_ref = db.ref("devices");

//commented out, not relevant anymore. Printing out node IP address on startup isnt interesting to DB wrapper
//node_ref.once("value", function(snapshot) {
//  console.log(snapshot.val());
//});

app.get("/", async (req, res) => {
  res.send("GET and POST at /api/node and /api/recordings are implemented, respond with JSON objects")
})

app.get("/api/node", async (req, res) => {
  try {
  node_ref.once("value", function(snapshot) {
    let data = snapshot.val()
    console.log(data)
    res.send(data);
  });
  } catch (error) {
  console.log(error)
  res.send("");
}
})

app.post("/api/node", async (req, res) => {
  console.log(req.body);
  res.send("sent")
  var nodeRef = node_ref.child("node");
  //TODO: validate body
  node_ref.set({
    ip: req.body.ip,
    port: req.body.port
  });
})


app.get("/api/recordings", async (req, res) => {
  if(! req.query.user) {
    let message = {
      error: "Please provide query param 'user' in recordings request"
    }
    res.send(message)
  } else {
    try {
      recordings_ref.once("value", function(snapshot) {
        let data = snapshot.val()
        if(!data) {
          res.send(null)
        } else {
          let userRecordings = data[req.query.user]
          console.log(userRecordings)
          res.send(userRecordings);
        }
      });
    } catch (error) {
      console.log(error)
      res.send(null);
    }
  }
})

app.post("/api/recordings", async (req, res) => {
  console.log(req.body);
  res.send("sent")
  var recordingsRef = recordings_ref.child("/"+req.query.user);
  let recordings = req.body.recordings;
  recordingsRef.set(recordings);
})



//get device details by id
app.get("/api/devices/:id", async (req, res) => {
  let ref = devices_ref.child("/"+req.params.id);
  ref.once("value", function(snapshot) {
    //what if null because nothing found? New device routine? 
    let data = snapshot.val()
    console.log(data)
    res.send(data)
  })
})

//create and update device configurations
//no checking on parameter legality implemented
app.post("/api/devices/:id/edit", async (req, res) => {
  let ref = devices_ref.child("/"+req.params.id);
  let body = req.body;
//  body.remoteAddress = req.connection.remoteAddress;
//  body.ip = req.ip;
  body.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //works thru proxies  

  ref.update(body);
  console.log("device settings saved")
  res.send(body)
})


app.get("/*", async (req, res) => {
  res.send("not found")
})

app.listen(process.env.PORT || 3001, function() {
  console.log("sleek-v2-firebase");
});
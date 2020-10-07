const express       = require("express");
const bodyParser = require('body-parser');
const app           = express();
app.use(bodyParser.json());


const admin         = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert({
    "private_key": process.env.FIREBASE_PRIVATE_KEY,
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "project_id": process.env.PROJECT_ID,
  }),
  databaseURL: process.env.DATABASE_URL,
});

var db = admin.database();

// const node_ref = db.ref("node");
// node_ref.once("value", function(snapshot) {
//   console.log(snapshot.val());
// });

app.get("/", async (req, res) => {
  res.send("GET and POST at /api/node are implemented, respond with JSON objects")
})

// app.get("/api/node", async (req, res) => {
//   node_ref.once("value", function(snapshot) {
//     let data = snapshot.val()
//     console.log(data)
//     res.send(data);
//   });
// })

// app.post("/api/node", async (req, res) => {
//   console.log(req.body);
//   res.send("sent")
//   var nodeRef = node_ref.child("node");
//   //TODO: validate body
//   node_ref.set({
//     ip: req.body.ip,
//     port: req.body.port
//   });
// })

app.get("/*", async (req, res) => {
  res.send("not found")
})

app.listen(process.env.PORT || 3001, function() {
  console.log("sleek-v2-firebase");
});
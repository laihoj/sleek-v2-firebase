context server hosted at heroku https://sleek-v2-firebase.herokuapp.com/

Firebase wrapper. Send REST requests, responds with JSON bodies.

purpose of server is to be a fixed domain to which locally running servers declare their IP and PORT
so that other local services may automatically connect to each other.

current setup does not support running the context server locally -> (firebase creds are available in ../firebase-secrets but rather use environment)


const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const todos = require('./services/todos');
const users = require('./services/users');
const port = 3000;

app.use(bodyParser.json());
app.use(express.json());

app.get('/', (req, res) => res.send('This route is not protected'));


/*********************************************
 * API KEY DEMO
 ********************************************/
app.get('/apiKeyGetKey/:userId', (req, res) => {
  const userId = req.params.userId;
  let apiKey = users.getApiKey(userId);
  if(apiKey === false) // user not found
  {
    res.sendStatus(400);
  }
  if(apiKey === null)
  {
    apiKey = users.resetApiKey(userId)
  }
  res.json({
    apiKey
  })
});

function checkForApiKey(req, res, next)
{  
  const receivedKey = req.get('X-Api-Key');
  if(receivedKey === undefined)
  {
    return res.status(400).json({ reason: "X-Api-Key header missing"});
  }

  const user = users.getUserWithApiKey(receivedKey);
  if(user === undefined)
  {
    return res.status(400).json({ reason: "Incorrect api key"});
  }

  req.user = user;

  // pass the control to the next handler in line
  next();  
}

app.get('/apiKeyProtectedResource', checkForApiKey, (req, res) => {
  res.json({
    yourResource: "foo"
  })
});

/*********************************************
 * HTTP Basic Authentication
 ********************************************/
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;

passport.use(new BasicStrategy(
  function(username, password, done) {

    const user = users.getUserByName(username);
    if(user == undefined)
    {
      // Username not found
      console.log("HTTP Basic username not found");
      return done(null, false, { message: "HTTP Basic username not found" });
    }

    /* Verify password match, note that the password here is in plaintext.
       DO NOT EVER STORE PASSWORDS in plaintexts */
    if(user.password !== password) 
    {
      // Password does not match
      console.log("HTTP Basic password not matching username");
      return done(null, false, { message: "HTTP Basic password not found" });
    }
    return done(null, user);
  }
));

app.get('/httpBasicProtectedResource',
        passport.authenticate('basic', { session: false }),
        (req, res) => {
  
  res.json({
    yourProtectedResource: "profit"
  });
});


/*********************************************
 * JWT authentication
 ********************************************/
let JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
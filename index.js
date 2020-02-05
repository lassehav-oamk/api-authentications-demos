const express = require('express');

const app = express();
const todos = require('./services/todos');
const users = require('./services/users');
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => res.send('This route is not protected'));


/*********************************************
 * API KEY DEMO
 ********************************************/
app.get('/apiKeyGenerate/:userId', (req, res) => {
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
 * Passport module used
 * http://www.passportjs.org/packages/passport-http/
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
 * Passport module is used, see documentation 
 * http://www.passportjs.org/packages/passport-jwt/
 ********************************************/
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt;
const jwtSecretKey = require('./jwt-key.json');


let options = {}

/* Configure the passport-jwt module to expect JWT
   in headers from Authorization field as Bearer token */
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

/* This is the secret signing key.
   You should NEVER store it in code  */
options.secretOrKey = jwtSecretKey.secret;

passport.use(new JwtStrategy(options, function(jwt_payload, done) {
  console.log("Processing JWT payload for token content:");
  console.log(jwt_payload);

  
  /* Here you could do some processing based on the JWT payload.
  For example check if the key is still valid based on expires property.
  */
  const now = Date.now() / 1000;
  if(jwt_payload.exp > now)
  {
    done(null, jwt_payload.user);
  }
  else // expired
  {
    done(null, false);
  }
}));


app.get(
  '/jwtProtectedResource', 
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log("jwt");
    res.json(
      { 
        status: "Successfully accessed protected resource with JWT",
        user: req.user
      }
    );
  }
);

app.get(
  '/loginForJWT', 
  passport.authenticate('basic', { session: false }),
  (req, res) => {
    const body = { 
      id: req.user.id,
      email : req.user.email 
    };  

    const payload = {
      user : body
    };

    const options = {
      expiresIn: '10s'
    }

    /* Sign the token with payload, key and options.
       Detailed documentation of the signing here:
       https://github.com/auth0/node-jsonwebtoken#readme */
    const token = jwt.sign(payload, jwtSecretKey.secret, options);

    return res.json({ token });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
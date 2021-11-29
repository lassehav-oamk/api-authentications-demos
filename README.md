# api-authentications-demos
This repository demonstrates the use of Express + Passport to do HTTP Basic and JWT based authentications. 

## Getting started
* Clone the repository
* Create new file `jwt-key.json` with the following structure
`
{
  "secret": "YourJWTSigninKeyHere"
}
`
* Install dependencies `npm install`
* Start the application `node index.js`
* Use Postman (or equivalent) to send HTTP requests to the API

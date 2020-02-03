const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const todos = require('./services/todos');
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

/*
console.log(todos.getAllTodos());
todos.insertTodo("Test", (new Date()).toISOString(), 1);
console.log(todos.getAllTodos());
todos.insertTodo("Test 2", (new Date()).toISOString(), 2);
console.log(todos.getAllTodos());
console.log(todos.getAllUserTodos(2));
*/



app.use(express.json());


app.get('/', (req, res) => res.send('This route is not protected'));

app.post('/apiKeyLogin', (req, res) => {
  if(req.body.username === undefined || req.body.password === undefined)
  {
    res.sendStatus(400);
    return;
  }
  res.json(users);
})



app.post('/users', (req, res) => {
  console.log('Hello /users');
  
  if(req.body.hasOwnProperty('email'))
  {
    // I accept or validate more
    const result = {
      id: 234622
    };

    users.push({
      id: users.length + 1,
      username: req.body.username,
      name: req.body.name,
      dateOfBirth: req.body.dateOfBirth,
      address: req.body.address,
      city: req.body.city,
      country: req.body.country,
      email: req.body.email
    })
  
    res.status(201).json(result);
  }
  else
  {
    res.sendStatus(400);
  }


  
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
const uuidv4 = require('uuid/v4');

let users = [
  {
    id: 1,
    userName: 'tester',
    email: 'tester@mail.com',
    password: 'testerpassword', // Example only! Do NOT EVER STORE PASSWORD ANYWHERE IN PLAINTEXT!
    validApiKey: null
  },
  {
    id: 2,
    userName: "johndoe",
    email: 'john@mail.com',
    password: 'johndoepassword', // Example only! Do NOT EVER STORE PASSWORD ANYWHERE IN PLAINTEXT!
    validApiKey: null
  },
];

module.exports = {
  getUserById: (id) => users.find(u => u.id == id),
  getUserByName: (userName) => users.find(u => u.userName == userName),
  resetApiKey: (userId) => {
    const user = users.find(u => u.id == userId);
    if(user === undefined)
    {
      return false
    }

    user.validApiKey = uuidv4();
    return user.validApiKey;
  },
  getApiKey: (userId) => {
    const user = users.find(u => u.id == userId);
    if(user === undefined)
    {
      return false
    }
    
    return user.validApiKey;
  },
  getUserWithApiKey: (apiKey) => users.find(u => u.validApiKey == apiKey)

}
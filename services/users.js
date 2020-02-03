
let users = [
  {
    id: 1,
    userName: 'tester',
    password: 'testerpassword' // Example only! Do NOT EVER STORE PASSWORD ANYWHERE IN PLAINTEXT!
  },
  {
    id: 2,
    userName: "johndoe",
    password: 'johndoepassword' // Example only! Do NOT EVER STORE PASSWORD ANYWHERE IN PLAINTEXT!
  },
];

module.exports = {
  getUserByName: (username) => users.find(u => u.userName == username),
}
const uuidv4 = require('uuid/v4');


let todos = [];

module.exports = {
  insertTodo: (description, dueDate,  userId) => {
    todos.push({
      id: uuidv4(),
      userId,
      description,
      dueDate,
      status: "open"
    });
  },
  getAllTodos: () => todos,
  getAllUserTodos: (userId) => todos.filter(t => t.userId == userId),
  getTodo: (todoId) => todos.find(t => t.id == todoId)
}
var userController = require('/users/userController');

module.exports = function(app, express) {

  // User log in
  app.post('/api/login', userController.login);

  // New user sign up
  app.post('/api/signup', userController.signup);

  // User uploads an image to create a memory
  app.post('/api/upload', memoryController.upload);

  // User clicks button to view all memories
  app.get('/api/memories', memoryController.fetchMemories);

  // User clicks on specific memory to view details
  app.get('/api/memory', memoryController.fetchOne);

  // After upload and processing data, save memory to db
  app.post('/api/memory', memoryController.addOne);

};
module.exports = app => {
  const tutorials = require("../controllers/tutorial.controller.js");

  var router = require("express").Router();

  router.get("/login-test",tutorials.loginTest);

  router.get("/op/leave-get",tutorials.getLeave);

  router.post("/login",tutorials.login);

//   // Create a new Tutorial
//   router.post("/", tutorials.create);
//
//   // Retrieve all Tutorials
//   router.get("/", tutorials.findAll);
//
//   // Retrieve all published Tutorials
//   router.get("/published", tutorials.findAllPublished);
//
//   // Retrieve a single Tutorial with id
//   router.get("/:id", tutorials.findOne);
//
//   // Update a Tutorial with id
//   router.put("/:id", tutorials.update);
//
//   // Delete a Tutorial with id
//   router.delete("/:id", tutorials.delete);
// ``
//   // Delete all Tutorials
//   router.delete("/", tutorials.deleteAll);

  router.get("/login/session", tutorials.loadSession);

  router.get("/op/logout", tutorials.logout);

  router.post("/op/leave-create", tutorials.createLeave);

  app.use('/api', router);
};

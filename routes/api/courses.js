const router = require("express").Router();
const coursesController = require("../../controllers/coursesController");

// Matches with "/api/courses"
router.route("/")
  .get(coursesController.findAll)
  .post(coursesController.create);

// Matches with "/api/courses/:id"
router
  .route("/:id")
  .get(coursesController.findById)
  .put(coursesController.update)
  .delete(coursesController.remove);

module.exports = router;

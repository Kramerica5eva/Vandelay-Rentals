const router = require('express').Router();
const coursesController = require('../../controllers/coursesController');

// Matches with '/api/courses'
router.route('/')
  .get(coursesController.findAll)
  .post(coursesController.create);
// post route here is an admin route

// Matches with '/api/courses/:id'
router
  .route('/:id')
  .get(coursesController.findById)
  .put(coursesController.update)
  .delete(coursesController.remove);
  // delete route here is an admin route

router
  .route('/pay/:id')
  .put(coursesController.update);

router
  .route('/remove/:id')
  .put(coursesController.update);

module.exports = router;

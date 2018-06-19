const router = require("express").Router();
const articleRoutes = require("./articles");
const courseRoutes = require("./courses");
const rentalRoutes = require("./rentals");
const saleRoutes = require("./sales");

// Book routes
router.use("/articles", articleRoutes);
router.use("/courses", courseRoutes);
router.use("/rentals", rentalRoutes);
router.use("/sales", saleRoutes);

module.exports = router;

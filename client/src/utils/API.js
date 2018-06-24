import axios from "axios";

export default {

  // AUTHORIZATION ROUTES
  // Get user info
  getUser: function () {
    return axios.get('/user');
  },
  // New user signup
  signup: function (signupData) {
    return axios.post('/user', signupData);
  },
  // User login
  login: function (loginData) {
    return axios.post('/user/login', loginData);
  },
  // User logout
  logout: function () {
    return axios.post('/user/logout');
  },
  // Authentication Route
  // Checks to see if a user is logged in before seeing protected routes
  authenticate: function () {
    return axios.get('/user/auth');
  },

  // USER COURSE ROUTES
  // Gets all courses
  getAllCourses: function () {
    return axios.get('/api/courses/');
  },
  // Gets courses by id
  getCourseById: function (id) {
    return axios.get(`/api/courses/${id}`);
  },
  // Reserve a course
  reserveCourse: function (id, reservationData) {
    return axios.put(`/api/courses/${id}`, reservationData);
  },
  // Remove a reservation
  removeCourseReservation: function (id, reservationData) {
    return axios.put(`/api/courses/remove/${id}`, reservationData);
  },

  //  USER RENTAL ROUTES
  // Gets All Rentals - this one may not be necessary, depending on how we set this up
  getAllRentals: function () {
    return axios.get('/api/rentals/');
  },
  // Gets Rental item by category - if the user chooses Paddleboard or Kayak without first entering dates, this will pull all rentals.
  getRentalsByCategory: function (category) {
    return axios.get(`/api/rentals/${category}`);
  },
  // Gets Rental item by id - if the user chooses a particular item, this will pull the data for it.
  getRentalById: function (category, id) {
    return axios.get(`/api/rentals/${category}/${id}`);
  },
  // Gets rentals by Date range - pulls all available rentals within the dates given
  getRentalsByDates: function (from, to) {
    return axios.get(`/api/rentals/date/${from}/${to}`);
  },
  // Reserves Rental by date range - reservation data will include the item and the user.
  reserveRental: function (from, to, reservationData) {
    return axios.put(`/api/rentals/date/${from}/${to}`, reservationData);
  },
  // Cancels a reservation - 'reservationData' collected by event listener and should include the item info and the user.
  removeRentalReservation: function (from, to, reservationData) {
    return axios.put(`/api/rentals/remove/${from}/${to}`, reservationData);
  },

  //  USER SALE ROUTES
  // Gets all sale items
  getAllSaleItems: function () {
    return axios.get('/api/sales/');
  },
  // Gets a single sale item
  getSaleItemById: function (id) {
    return axios.get(`/api/sales/${id}`);
  },


  // ADMIN ROUTES
  // ADMIN USER ROUTES
  // Gets all users
  getAllUsers: function () {
    return axios.get('/admin/users');
  },
  addNewUser: function (userData) {
    return axios.post('/admin/users', userData);
  },
  // Gets one user by id
  getUserById: function (id) {
    return axios.get(`/admin/users/${id}`)
  },
  // Gets one user by id
  updateUser: function (id, userData) {
    return axios.put(`/admin/users/${id}`, userData);
  },
  // Gets one user by id
  deleteUser: function (id) {
    return axios.delete(`/admin/users/${id}`);
  },

  // ADMIN COURSE ROUTES
  // Gets all courses
  adminGetAllCourses: function () {
    return axios.get('/admin/courses/');
  },
  // Add new course
  adminAddNewCourse: function (courseData) {
    return axios.post('/admin/courses', courseData);
  },
  // Gets one course by id
  adminGetCourseById: function (id) {
    return axios.get(`/admin/courses/${id}`);
  },
  // Change 'paid' boolean to true
  payCourseReservation: function (id, reservationData) {
    return axios.put(`/admin/courses/${id}`, reservationData);
  },
  // Delete course from DB - admin function
  adminDeleteCourse: function (id) {
    return axios.delete(`/admin/courses/${id}`);
  },

  // ADMIN RENTAL ROUTES
  // Gets All Rentals
  adminGetAllRentals: function () {
    return axios.get('/admin/rentals/');
  },
  // Add new rental item - admin function
  adminAddNewRental: function (rentalData) {
    return axios.post('/admin/rentals', rentalData);
  },
  // Gets Rental item by id - if the user chooses a particular item, this will pull the data for it.
  adminGetRentalsById: function (id) {
    return axios.get(`/admin/rentals/${id}`);
  },
  // Update rental item data - admin function
  adminUpdateRental: function (id, rentalData) {
    return axios.put(`/admin/rentals/${id}`, rentalData);
  },
  // Remove rental item - admin function
  adminDeleteRentalItem: function (id) {
    return axios.delete(`/admin/rentals/${id}`);
  },

  // ADMIN SALE ROUTES
  // Gets all sale items
  adminGetAllSaleItems: function () {
    return axios.get('/admin/sales/');
  },
  // Add sale item to DB - admin function
  adminAddSaleItem: function (saleItemData) {
    return axios.post('/admin/sales', saleItemData);
  },
  // Gets a single sale item
  adminGetSaleItemById: function (id) {
    return axios.get(`/admin/sales/${id}`);
  },
  // Update sale item, including recording sale
  adminUpdateSaleItem: function (id, saleItemData) {
    return axios.put(`/admin/sales/${id}`, saleItemData);
  },
  // Remove sale item from DB - admin function
  adminDeleteSaleItem: function (id) {
    return axios.delete(`/admin/sales/${id}`);
  },

};

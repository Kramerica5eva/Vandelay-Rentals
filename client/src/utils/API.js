import axios from "axios";

export default {

  // USER ROUTES
  // User login
  login: function (loginData) {
    return axios.post('/user/login', loginData);
  },
  // Get user info
  getUser: function () {
    return axios.get('/user');
  },
  // New user signup
  signup: function (signupData) {
    return axios.post('/user', signupData);
  },
  // User logout
  logout: function () {
    return axios.post('/user/logout');
  },
  
  // COURSE ROUTES
  // Gets all courses
  getAllCourses: function() {
    return axios.get('/api/courses/');
  },
  // Create new course
  addNewCourse: function(courseData) {
    return axios.post('/api/courses', courseData);
  },
  // Gets courses by id
  getCourseById: function(id) {
    return axios.get(`/api/courses/${id}`);
  },
  // Reserve a course
  reserveCourseById: function(id, reservationData) {
    return axios.put(`/api/courses/${id}`, reservationData);
  },
  // Delete course from DB - admin function
  removeCourse: function(id) {
    return axios.delete(`/api/courses/${id}`);
  },
  // Change 'paid' boolean to true
  payCourseReservation: function (id, reservationData) {
    return axios.put(`/api/courses/pay/${id}`, reservationData);
  },
  // Remove a reservation
  removeCourseReservation: function(id, reservationData) {
    return axios.put(`/api/courses/remove/${id}`, reservationData);
  },


  //  RENTAL ROUTES
  // Gets All Rentals - this one may not be necessary, depending on how we set this up
  getAllRentals: function() {
    return axios.get('/api/rentals/');
  },
  // Add new rental item - admin function
  addNewRental: function(rentalData) {
    return axios.post('/api/rental', rentalData);
  },
  // Gets Rental item by category - if the user chooses Paddleboard or Kayak without first entering dates, this will pull all rentals.
  getRentalsByCategory: function(category) {
    return axios.get(`/api/rentals/${category}`)
  },
  // Gets Rental item by id - if the user chooses a particular item, this will pull the data for it.
  getRentalsById: function(category, id) {
    return axios.get(`/api/rentals/${category}/${id}`)
  },
  // Update rental item data - admin function
  updateRentalById: function(category, id, rentalData) {
    return axios.put(`/api/rentals/${category}/${id}`, rentalData);
  },
  // Remove rental item - admin function
  removeRentalById: function(category, id) {
    return axios.delete(`/api/rentals/${category}/${id}`);
  },
  // Gets rentals by Date range - pulls all available rentals within the dates given
  getRentalsByDates: function(from, to) {
    return axios.get(`/api/rentals/date/${from}/${to}`);
  },
  // Reserves Rental by date range - reservation data will include the item and the user.
  reserveRentalByDateRange: function(from, to, reservationData) {
    return axios.put(`/api/rentals/date/${from}/${to}`, reservationData);
  },
  // Cancels a reservation - 'reservationData' collected by event listener and should include the item info and the user.
  removeReservation: function(from, to, reservationData) {
    return axios.put(`/api/rentals/remove/${from}/${to}`, reservationData);
  },


  //  SALE ROUTES
  // Gets all sale items
  getAllSaleItems: function() {
    return axios.get('/api/sales/');
  },
  // Add sale item to DB - admin function
  addSaleItem: function(saleItemData) {
    return axios.post('/api/sales', saleItemData);
  },
  // Gets a single sale item
  getSaleItemById: function(id) {
    return axios.get(`/api/sales/${id}`);
  },
  // Update sale item, including recording sale
  updateSaleItemById: function(id, saleItemData) {
    return axios.put(`/api/sales/${id}`, saleItemData);
  },
  // Remove sale item from DB - admin function
  removeSaleItemById: function(id) {
    return axios.delete(`/api/sales/${id}`);
  },
};

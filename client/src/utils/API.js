import axios from "axios";

export default {

  getImageNames: function (id) {
    return axios.get(`/file/image/names/${id}`);
  },

  uploadImage: function (rentalId, imageData) {
    return axios.post(`/file/image/${rentalId}`, imageData);
  },

  getImage: function () {
    return axios.get('/file/image/:filename');
  },

  deleteImage: function (imageId, rentalId) {
    return axios.delete(`/file/image/${imageId}/${rentalId}`);
  },


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
  //  Checks current password before changing it
  checkPassword: function (pwData) {
    return axios.post('/user/check', pwData);
  },














  // CART ROUTES
  // Get user shopping cart  
  getUserShoppingCart: function (id) {
    return axios.get(`/api/cart/${id}`);
  },

  // TEST ADD COURSE TO CART
  addRegistrationToCart: function (id, registrationData) {
    return axios.post(`/api/cart/courses/${id}`, registrationData);
  },

  removeRegistrationFromCart: function (id) {
    return axios.delete(`/api/cart/courses/${id}`);
  },

  // TEST ADD RESERVATION TO CART - cart function will make reservation permanent later with the above function (reserveRental)
  addReservationToCart: function (from, to, rentalData) {
    return axios.post(`/api/cart/rentals/date/${from}/${to}`, rentalData);
  },

  removeReservationFromCart: (id) => {
    return axios.delete(`/api/cart/rentals/${id}`);
  },


  // USER ROUTES

  // USER COURSE ROUTES
  // Gets all courses
  getAllCourses: function () {
    return axios.get('/api/courses/');
  },

  // Reserve a course - Changes a course from a tempRegistration in the shopping cart to an actual reservation. Creates a Registration document, and populates the registration array for the Course and User.
  reserveCourse: function (id, reservationData) {
    return axios.post(`/api/courses/${id}`, reservationData);
  },

  // NOT CURRENTLY BEING USED
  // Remove a reservation
  removeCourseReservation: function (id, reservationData) {
    return axios.put(`/api/courses/remove/${id}`, reservationData);
  },

  // NOT CURRENTLY BEING USED
  // Gets course by id
  getCourseById: function (id) {
    return axios.get(`/api/courses/${id}`);
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

  // NOT CURRENTLY BEING USED
  // Gets Rental item by id - if the user chooses a particular item, this will pull the data for it.
  getRentalById: function (category, id) {
    return axios.get(`/api/rentals/${category}/${id}`);
  },

  // TEST RESERVATION SCHEMA STUFF - it works! This route creates a doc in the Reservations collection, and creates a reference in the associated User and Rental documents
  // Reserves Rental by date range
  reserveRental: function (from, to, rentalData) {
    return axios.post(`/api/rentals/date/${from}/${to}`, rentalData);
  },


  // Adds reservation data to user's database document
  addRentalToUser: function (from, to, id) {
    return axios.put(`/user/${from}/${to}/${id}`);
  },
  // Cancels a reservation - 'reservationData' collected by event listener and should include the item info and the user.
  removeRentalReservation: function (from, to, reservationId, reservationData) {
    return axios.put(`/api/rentals/remove/${from}/${to}/${reservationId}`, reservationData);
  },
  // Creates a new signature request using the helloSign API
  createSignatureRequest: function () {
    return axios.post('/file/waiver/create-signature-request',
      {
        clientEmail: "email@email.com",
        clientName: "John Smith",
        clientId: "aaad4deadb45633d2cc5ebe07ed2eff2",
        apiKey: "885fe716760ad052c0df78878bd1aeb6f09292b59d82fe035888a457cc4c133a"
      }
    )
  },

  //  USER SALE ROUTES
  // Gets all sale items
  getAllSaleItems: function () {
    return axios.get('/api/sales/');
  },
  // Gets a single sale item
  getSaleItemsByCategory: function (category) {
    return axios.get(`/api/sales/${category}`);
  },
  // Gets a single sale item
  getSaleItemById: function (category, id) {
    return axios.get(`/api/sales/${category}/${id}`);
  },

  // ADMIN ROUTES
  // ADMIN USER ROUTES
  // Gets all users
  adminGetAllUsers: function () {
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

  //ADMIN CATEGORY ROUTES
  // Gets all categories
  // This route is only in admin because a single route doesn't need a new pathway and controller file
  getAllCategories: function () {
    return axios.get('/admin/category');
  },
  // Add new category
  adminAddNewCategory: function (categoryData) {
    return axios.post('/admin/category', categoryData);
  },
  // Modify category
  adminUpdateCategory: function (id, categoryData) {
    return axios.put(`/admin/category/${id}`, categoryData);
  },
  // Delete category
  adminDeleteCategory: function (id) {
    return axios.delete(`/admin/category/${id}`);
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
  // Update course information
  adminUpdateCourse: function (id, courseData) {
    return axios.put(`/admin/courses/${id}`, courseData);
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



  //  TEST GETTING RESERVATION DATA FROM RENTAL QUERY:
  adminGetReservationsFromRental: function (id) {
    return axios.get(`/admin/rentals/reservations/${id}`);
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

# Vandelay Rentals - Outdoor Gear Rental App
  
## Table of contents
  
### 1-Description
### 2-Technologies
### 3-Challenges
### 4-Issues
### 5-Desired Features
### 6-Contributors

### 1-Description
Vandelay Rentals is an outdoor gear app for renting and purchasing kayaks and paddleboards or reserving a spot in an outdoor skills class. The app's major functions include a reactive calendar showing availability for each rental item, administrative functions for inventory management and maintaining customer data, and payment processing via Stripe. Other app functions include signing waivers through Hello Sign, uploading images to the database so business owners can document the condition of rental items before and after checkout, and user authentication


### 2-Technologies
  This project utilizes the following technologies:
- HTML
- CSS
- Vanilla JavaScript
- [React.js](https://reactjs.org/)
- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [React Router](https://reacttraining.com/react-router/)
- [Mongoose](http://mongoosejs.com/)
- [Stripe](https://stripe.com/)
- [React Table](https://react-table.js.org/#/story/readme)
- [Passport.js](http://www.passportjs.org/)
- [Hello Sign](https://www.hellosign.com/)
- [Date-fns](https://date-fns.org/)
- [Multer](https://www.npmjs.com/package/multer)
- [Gridfs-stream](https://www.npmjs.com/package/gridfs-stream)
- [Heroku](https://www.heroku.com/)
- [Google Fonts](https://fonts.google.com/)
- Security and Session Storage
- User Authentication
- Responsive Design

### 3-Challenges
Integrating any unfamiliar technology presents challenges. This project integrates several technologies that were new to us, and we all learned a lot along the way. Building our first large project with React pushed us to think about familiar functionality in a different way. It isn't necessarily more difficult, but it does require a different approach.

Documentation can often be hard to understand the first time through, though it often seems much clearer in hindsight. Stripe seemed fairly complex the first time through, as did handling image uploads via multer and GridFS, but the knowledge we gained from traversing the steep learning curve should prove valuable in the future. React Table, on the other hand, has excellent documentation that made initial setup extremely easy. Customizing it proved challenging, but it was fun and interesting, too.

Part of the core functionality of our app is the calendar. It interacts with current reservation and cart data in order to display availability for each rental item. There are plenty of good calendar packages out there, but none that specifically fulfilled all of our requirements. So, we (that is to say, Ben) built our calendar from the ground up. A difficult task, for sure, but the result is, we think, something to be proud of.

Creating parallax scrolling in a React app also required a somewhat different approach than building it in a static page, but again, the knowledge gained makes us better developers.

### 4-Issues
  Currently there are no known issues that need to be resolved.

### 5-Future Development
  Though the app is fully functional as it stands, we do have a few ideas we plan to incorporate into this project:
1.  The ability to add items to a cart without having to login first (though login would be required for checkout)
2.  Fine tuning the admin tables to implement React Table's SelectTreeTable design
3.  Marking an item as damaged and putting it into a status that would put rentals on hold until the issue (or other such issue) is resolved.
4.  Marking an item as checked out
5.  More functionality regarding dates in the database (for example, it's currently possible to mark a rental reservation as checked in before the rental date has even arrived)
6.  Integrated image cropping so the business owner can upload images of new products they want to offer without distorting or breaking the page layouts with odd-shaped images.

### 6-Contributors
- [Keith Allmon](https://github.com/Strangebrewer/)
- [Nick Brown](https://github.com/nick-d-brown)
- [Ben Caler](https://github.com/benwcaler)
- [Corbin Moore](https://github.com/corbinmoore27)
- [Brandon Morin](https://github.com/Morinventiv)

**PS:** If you would like to contribute please contact us on GitHub or at vandelayrentals.contact@gmail.com.
## Thanks for visiting!
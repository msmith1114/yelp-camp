# Yelp-Camp
Node.JS/MongoDB CRUD App

This was created via the Udemy "Web Developer Boot Camp" Course.

## How to Run This App

1. **Install Dependencies**

   Open a terminal in this directory and run:

   ```powershell
   npm install
   ```

2. **Start MongoDB**

   Make sure you have MongoDB installed and running locally. By default, the app connects to `mongodb://localhost/yelp_camp`.

3. **Run the App**

   Start the server with:

   ```powershell
   node app.js
   ```

   The app will start on [http://localhost:3000](http://localhost:3000).


4. **Seed the Database**

   To seed the database with sample data, run:

   ```powershell
   npm run seed
   ```

   This will execute the `seed.js` script and populate your database with sample campgrounds.

## Requirements

- Node.js
- npm
- MongoDB

## Project Structure

- `app.js` - Main application file
- `models/` - Mongoose models
- `routes/` - Express route files
- `views/` - EJS templates
- `public/` - Static assets (CSS, images)

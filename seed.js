const mongoose = require('mongoose');
const seedDB = require('./seeds');

mongoose.connect('mongodb://localhost/yelp_camp');

(async () => {
  await seedDB();
  console.log('Database seeded!');
  mongoose.connection.close();
})();

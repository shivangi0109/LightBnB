const properties = require("./json/properties.json");
const users = require("./json/users.json");

const { Pool } = require('pg');

// Create a new pool instance using your database configuration
const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  return pool
    .query(`SELECT * FROM users WHERE email = $1`, [email])
    .then((result) => {
      if (result.rows.length === 0) {
        return null; // User with the given email doesn't exist
      }
      // console.log(result.rows[0]);
      return result.rows[0]; // Return the user object
    })
    .catch((err) => {
      console.log(err.message);
    });
};

// getUserWithEmail('michaelgray@mail.com');

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return pool
    .query(`SELECT * FROM users WHERE id = $1`, [id])
    .then((result) => {
      if (result.rows.length === 0) {
        return null; // User with the given id doesn't exist
      }
      // console.log(result.rows);
      // console.log(result.rows[0]);
      return result.rows[0]; // Return the user object
    })
    .catch((err) => {
      console.log(err.message);
    });
};

// getUserWithId(7);

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  return pool
    .query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`, // Add RETURNING *; to the end of an INSERT query to return the objects that were inserted. This is handy when you need the auto generated id of an object you've just added to the database
      [user.name, user.email, user.password]
    )
    .then((result) => {
      return result.rows[0]; // Return the new user object with the auto-generated id
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return pool
    .query(
      `SELECT reservations.id, properties.title, reservations.start_date, properties.cost_per_night, properties.cover_photo_url, properties.thumbnail_photo_url, properties.number_of_bathrooms, properties.number_of_bedrooms, properties.parking_spaces, AVG(property_reviews.rating) AS average_rating
      FROM reservations
      JOIN properties ON reservations.property_id = properties.id
      JOIN property_reviews ON property_reviews.property_id = properties.id
      WHERE reservations.guest_id = $1
      GROUP BY reservations.id, properties.title, properties.cost_per_night, properties.number_of_bathrooms, properties.number_of_bedrooms, properties.parking_spaces, properties.cover_photo_url, properties.thumbnail_photo_url
      ORDER BY reservations.start_date
      LIMIT $2;`,
      [guest_id, limit]
    )
    .then((result) => {
      return result.rows; // Return the new user object with the auto-generated id
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  // Start building the query
  let queryString = `
    SELECT properties.*, AVG(property_reviews.rating) AS average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_id
  `;
  
  const queryParams = [];
  let whereClause = '';

  // Check for filter options provided
  if (options) {
    queryParams.push(`%${options.city}%`);
    whereClause = `WHERE properties.city LIKE $${queryParams.length} `;
    
    if (options.owner_id) {
      queryParams.push(options.owner_id);
      whereClause += `AND properties.owner_id = $${queryParams.length} `;
    }

    if (options.minimum_price_per_night) {
      queryParams.push(options.minimum_price_per_night * 100); // Convert to cents
      whereClause += `AND properties.cost_per_night >= $${queryParams.length} `;
    }

    if (options.maximum_price_per_night) {
      queryParams.push(options.maximum_price_per_night * 100); // Convert to cents
      whereClause += `AND properties.cost_per_night <= $${queryParams.length} `;
    }

    whereClause += 'GROUP BY properties.id ';
    
    if (options.minimum_rating) {
      queryParams.push(options.minimum_rating);
      whereClause += `HAVING AVG(property_reviews.rating) >= $${queryParams.length} `;
    }
  } else {
    whereClause = 'GROUP BY properties.id ';
  }

  // Complete the query
  queryString += whereClause;
  queryString += 'ORDER BY cost_per_night ';
  queryParams.push(limit);
  queryString += `LIMIT $${queryParams.length};`;

  // Use the pool.query method to execute the query
  return pool
    .query(queryString, queryParams)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

// const getAllProperties = (options, limit = 10) => {

//   // Use the pool.query method to execute the query
//   return pool
//     .query(`SELECT * FROM properties LIMIT $1`, [limit])
//     .then((result) => {
//       // console.log(result.rows);
//       // Return the rows from the query result
//       return result.rows;
//     })
//     .catch((err) => {
//       console.log(err.message);
//     });
// };

// const getAllProperties = function (options, limit = 10) {
//   const limitedProperties = {};
//   for (let i = 1; i <= limit; i++) {
//     limitedProperties[i] = properties[i];
//   }
//   return Promise.resolve(limitedProperties);
// };

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};

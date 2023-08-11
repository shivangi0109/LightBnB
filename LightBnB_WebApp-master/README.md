# LightBnB

## Project Structure

```
.
├── db
│   ├── json
│   └── database.js
├── public
│   ├── javascript
│   │   ├── components 
│   │   │   ├── header.js
│   │   │   ├── login_form.js
│   │   │   ├── new_property_form.js
│   │   │   ├── property_listing.js
│   │   │   ├── property_listings.js
│   │   │   ├── search_form.js
│   │   │   └── signup_form.js
│   │   ├── libraries
│   │   ├── index.js
│   │   ├── network.js
│   │   └── views_manager.js
│   ├── styles
│   │   ├── main.css
│   │   └── main.css.map
│   └── index.html
├── routes
│   ├── apiRoutes.js
│   └── userRoutes.js
├── styles  
│   ├── _forms.scss
│   ├── _header.scss
│   ├── _property-listings.scss
│   └── main.scss
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── server.js
```

* `db` contains all the database interaction code.
  * `json` is a directory that contains a bunch of dummy data in `.json` files.
  * `database.js` is responsible for all queries to the database. It doesn't currently connect to any database, all it does is return data from `.json` files.
* `public` contains all of the HTML, CSS, and client side JavaScript. 
  * `index.html` is the entry point to the application. It's the only html page because this is a single page application.
  * `javascript` contains all of the client side javascript files.
    * `index.js` starts up the application by rendering the listings.
    * `network.js` manages all ajax requests to the server.
    * `views_manager.js` manages which components appear on screen.
    * `components` contains all of the individual html components. They are all created using jQuery.
* `routes` contains the router files which are responsible for any HTTP requests to `/users/something` or `/api/something`. 
* `styles` contains all of the sass files. 
* `server.js` is the entry point to the application. This connects the routes to the database.

## Final Product


## Getting Started

- Download the project from https://github.com/lighthouse-labs/LightBnB_WebApp.
- Don't clone this project, just select the Download Zip option.
- Once the project has downloaded:
  - Extract and drag the extracted LightBnB_WebApp folder into your lightbnb folder.
  - cd into the LightBnB_WebApp directory.
  - Install any dependencies with npm i.
- Run the app npm run local and view it at localhost:3000.
- You may need to have npx installed first. npm install -g npx.

- node-postgres is a library that allows us to connect to our PostgreSQL database, directly from our node applications. Run npm install pg.
- When we're using terminal to execute SQL queries, we first have to connect to the database using a client app like psql. If we wanted to connect to the lightbnb    database, we could enter psql lightbnb OR psql -h localhost -p 5432 -U vagrant lightbnb into terminal.
- This will connect us to a PostgreSQL database running on localhost port 5432 with the user vagrant.
- If you are prompted for a password you may need to update your vagrant user with a new password by following the steps below:
  - Go into psql
  - Run \password
  - Type 123 and hit Enter
- Using node-postgres, we can connect to our database without specifying any options:

```JavaScript
const { Pool } = require('pg');

const pool = new Pool();
```

OR 

- we can specify different connection options:

```JavaScript
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});
```

- Test this query SELECT * FROM users WHERE email = 'michaelgray@mail.com'; in psql, if it is working.
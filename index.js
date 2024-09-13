const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const sqlstring = require('sqlstring');
sqlstring.format

const app = express();
const PORT = 3000;

// Custom middleware to parse JSON
function parseJsonInQueryParams(req, res, next) {
    for (const key in req.query) {
        try {
            req.query[key] = JSON.parse(decodeURIComponent(req.query[key]));
        } catch (error) {
            console.error(`Failed to parse query parameter '${key}':`, error);
        }
    }
    next();
}

// Set up middleware
app.use(parseJsonInQueryParams);
app.use(express.static('public'));

// Initialize MySQL database connection
const db = mysql.createConnection({
    host: 'mysql',
    user: 'root',
    password: 'example',  // Replace with your MySQL password
    database: 'mydb'      // Replace with your MySQL database name
});

// Connect to MySQL database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
    } else {
        console.log('Connected to MySQL database.');
    }
});

// Create users table if not exists
const createTableQuery = `
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);`;

db.query(createTableQuery, (err) => {
    if (err) {
        console.error('Error creating table:', err.message);
    } else {
        console.log('Users table is ready.');
    }
});

// Add a test user to the database
db.query("INSERT INTO users (username, password) VALUES ('AdminClark', 'br^,CREDT?4pdf6g7Pco');", (err) => {
    if (err) {
        console.error('Error inserting test user:', err.message);
    } else {
        console.log('Test user added.');
    }
});
db.query("INSERT INTO users (username, password) VALUES ('Dave', 'yE.7}B}H%yPk_PKoJrCh');", (err) => {
    if (err) {
        console.error('Error inserting test user:', err.message);
    } else {
        console.log('Test user added.');
    }
});
db.query("INSERT INTO users (username, password) VALUES ('Ava', 'ns9b9~9RHVyjsX.FeBvA');", (err) => {
    if (err) {
        console.error('Error inserting test user:', err.message);
    } else {
        console.log('Test user added.');
    }
});

// Route for the login page
app.get('/login', (req, res) => {
    if (req.query.username && req.query.password) {
        const { username, password } = req.query;
    
        // SQL query using placeholders for the prepared statement
        const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    
        // Use the `db.query()` method with the query and values to bind
        db.query(query, [username, password], (err, results) => {
            if (err) {
                console.error(err.message);
                res.status(500).send('Internal Server Error');
            } else if (results.length > 0) {
                res.send(`<h1>Welcome, ${results[0].username}!</h1>`);
            } else {
                res.send('<h1>Invalid credentials, please try again.</h1>');
            }
        });
    }
    else res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const db = require("../db");

const createUserTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    )`;

  db.query(sql, (err) => {
    if (err) {
      console.error("Error creating users table:", err);
    } else {
      console.log("Users table created successfully!");
    }
  });
};

module.exports = { createUserTable };

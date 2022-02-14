 const Pool = require('pg').Pool

// //local db connection
const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: "localhost",
  port: 5432,
  database: process.env.PGDATABASE
});


// var dbConnection = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@localhost/sapphodb`

// const pool = new Pool({
//   dbConnection,
// })

module.exports = pool
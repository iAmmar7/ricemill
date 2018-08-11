var mysql = require('mysql')

// var connection = mysql.createConnection({
//   host: 'sql12.freemysqlhosting.net',
//   user: 'sql12246627',
//   password: 'Knst5sCzVp',
//   database : 'sql12246627',
//   port : process.env.DB_PORT
// })
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database : 'ricemill',
  port : 3306
})


connection.connect()

module.exports = connection;
var mysql = require('mysql2');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1234',
  database : 'opentutorials'
});

connection.connect();

connection.query('SELECT * from topic', function (error, results, fields) {
  if (error) console.log(error);
  
  console.log(results);
});

connection.end();
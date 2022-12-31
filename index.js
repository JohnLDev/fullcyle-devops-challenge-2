const express = require('express');
var mysql = require('mysql');
const { faker } = require('@faker-js/faker');

const PORT = 3000;

var connection = mysql.createConnection({
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'database',
});

connection.connect();

async function query(sql) {
  return new Promise((resolve, reject) => {
    connection.query(sql, (error, results, fields) => {
      if (error) {
        reject(error);
      }
      resolve(results);
    });
  });
}

async function prepareDB() {
  await query(
    `CREATE TABLE if not exists people (id int NOT NULL AUTO_INCREMENT, name varchar(255) NOT NULL, PRIMARY KEY (id));`
  );
}

async function insertName() {
  await query(
    `INSERT INTO people (name) VALUES ('${faker.name
      .fullName()
      .replace(/'/g, '')}')`
  );
}

async function getNames() {
  return query(`SELECT * FROM people;`);
}

(async function () {
  await prepareDB();
  const app = express();

  app.get('/', async (req, res) => {
    await insertName();
    const names = await getNames();
    res.send(`
        <h1>Full Cycle Rocks!</h1>
        - Lista de nomes cadastrada no banco de dados.
        <ul>
          ${names.map((name) => `<li>${name.name}</li>`).join('')}
        </ul>
  `);
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();

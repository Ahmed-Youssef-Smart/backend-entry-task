const {Pool} = require('pg');

const pool = new Pool({
  user: 'postgres',          
  host: 'localhost',         
  database: 'products',      
  password: '1234',          
  port: 5432,               
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('error connection', err.stack);
  }
  console.log('sucuss');
  release(); 
});

module.exports = pool;

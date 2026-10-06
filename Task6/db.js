const { DataSource } = require("typeorm");
const User = require("./User");
const Note = require("./Note");

const AppDataSource = new DataSource({
    type: "postgres", 
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "1234",
    database: "notes_db",
    synchronize: true, 
    logging: false,
    entities: [User, Note],
});

module.exports = AppDataSource;

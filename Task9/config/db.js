require("dotenv").config();
const { DataSource } = require("typeorm");
const { UserSchema } = require("../entities/User");
const { NoteSchema } = require("../entities/Note");

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "1234",
    database: process.env.DB_NAME || "notes_db",
    synchronize: process.env.NODE_ENV !== "production",
    logging: false,
    entities: [UserSchema, NoteSchema],
});

module.exports = AppDataSource;

const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "User",
    tableName: "users",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        name: {
            type: "varchar",
        },
        email: {
            type: "varchar",
            unique: true,
            nullable: false,
        },
        password: {
            type: "varchar",
            nullable: false,
        },
        role: {
            type: "varchar",
            default: "user", // "user" أو "admin"
        },
    },
    relations: {
        posts: {
            target: "Post",
            type: "one-to-many",
            inverseSide: "user",
            cascade: true,
        },
    },
});

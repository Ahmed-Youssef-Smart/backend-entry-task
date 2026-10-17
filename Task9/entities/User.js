const { EntitySchema } = require("typeorm");

const UserSchema = new EntitySchema({
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
            length: 100,
        },
        email: {
            type: "varchar",
            length: 150,
            unique: true,
        },
        password: {
            type: "varchar",
        },
        role: {
            type: "varchar",
            default: "user",
        },
        createdAt: {
            type: "timestamp",
            createDate: true,
        },
        updatedAt: {
            type: "timestamp",
            updateDate: true,
        },
    },
    relations: {
        notes: {
            type: "one-to-many",
            target: "Note",
            inverseSide: "user",
        },
    },
});

module.exports = { UserSchema };

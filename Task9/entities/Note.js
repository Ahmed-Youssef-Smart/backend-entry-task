const { EntitySchema } = require("typeorm");

const NoteSchema = new EntitySchema({
    name: "Note",
    tableName: "notes",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        title: {
            type: "varchar",
            length: 255,
        },
        content: {
            type: "text",
        },
        userId: {
            type: "int",
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
        user: {
            type: "many-to-one",
            target: "User",
            joinColumn: { name: "userId" },
            onDelete: "CASCADE",
        },
    },
});

module.exports = { NoteSchema };

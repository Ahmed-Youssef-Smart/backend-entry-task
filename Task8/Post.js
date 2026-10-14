const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Post",
    tableName: "posts",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        post_title: {
            type: "varchar",
        },
        post_content: {
            type: "text",
        },
    },
    relations: {
        user: {
            target: "User",
            type: "many-to-one",
            joinColumn: {
                name: "userId",
            },
            onDelete: "CASCADE",
        },
    },
});

require("dotenv").config();
const app = require("./app");
const AppDataSource = require("./config/db");

const PORT = process.env.PORT || 5000;

async function bootstrap() {
    try {
        await AppDataSource.initialize();
        console.log("Database connected successfully");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
}

bootstrap();

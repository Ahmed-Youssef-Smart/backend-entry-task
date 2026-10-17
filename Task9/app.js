const express = require("express");
const authRoutes = require("./routes/auth.routes.js");
const userRoutes = require("./routes/user.routes.js");
const noteRoutes = require("./routes/note.routes.js");

const app = express();

app.use(express.json());

// ربط الموجهات (Routes)
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);

// فحص جاهزية السيرفر (Health Check)
app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date() });
});

// معالج الأخطاء العام
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status: "error", message: "Something went wrong!" });
});

module.exports = app;

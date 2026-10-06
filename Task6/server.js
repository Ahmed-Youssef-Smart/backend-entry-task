const express = require("express");
const AppDataSource = require("./db");

const app = express();
app.use(express.json()); 

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    });

app.post("/users", async (req, res) => {
    try {
        const { name } = req.body;
        const userRepository = AppDataSource.getRepository("User");
        const newUser = userRepository.create({ name });
        const savedUser = await userRepository.save(newUser);
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.delete("/users/:id", async (req, res) => {
    try {
        const userRepository = AppDataSource.getRepository("User");
        const user = await userRepository.findOneBy({ id: parseInt(req.params.id) });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await userRepository.remove(user);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.post("/notes", async (req, res) => {
    try {
        const { title, content, userId } = req.body;
        const noteRepository = AppDataSource.getRepository("Note");
        const userRepository = AppDataSource.getRepository("User");

        const user = await userRepository.findOneBy({ id: parseInt(userId) });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newNote = noteRepository.create({ title, content, user });
        const savedNote = await noteRepository.save(newNote);
        res.status(201).json(savedNote);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


app.get("/notes", async (req, res) => {
    try {
        const noteRepository = AppDataSource.getRepository("Note");
        const notes = await noteRepository.find({
            relations: {
                user: true,
            },
        });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.get("/notes/user/:userId", async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        if (isNaN(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const noteRepository = AppDataSource.getRepository("Note");
        const notes = await noteRepository.find({
            where: { user: { id: userId } },
            relations: {
                user: true,
            },
        });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

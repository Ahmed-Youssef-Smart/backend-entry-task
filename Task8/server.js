require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const AppDataSource = require("./db");
const User = require("./User");
const Post = require("./Post");
const { hashPassword, comparePasswords } = require("./hash");
const authMiddleware = require("./middleware/auth.middleware");
const requireRole = require("./middleware/role.middleware");
const { validate, userSchema, loginSchema, postSchema } = require("./middleware/validate");

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";

// تهيئة الاتصال بقاعدة البيانات
AppDataSource.initialize()
    .then(() => {
        console.log("Database connected successfully!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    });

// ==========================================
// 1. مسار تسجيل مستخدم جديد (مفتوح / Register)
// ==========================================
app.post("/register", validate(userSchema), async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const userRepository = AppDataSource.getRepository(User);

        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered" });
        }

        const hashedPassword = await hashPassword(password);
        const newUser = userRepository.create({
            name,
            email,
            password: hashedPassword,
            role: role || "user",
        });

        const savedUser = await userRepository.save(newUser);
        const { password: _, ...userData } = savedUser;
        res.status(201).json({ message: "User registered successfully", user: userData });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// =======================================================
// 2. إضافة مستخدم جديد (صلاحية: user و admin معاً)
// =======================================================
app.post("/users", authMiddleware, requireRole("user", "admin"), validate(userSchema), async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const userRepository = AppDataSource.getRepository(User);

        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered" });
        }

        const hashedPassword = await hashPassword(password);
        const newUser = userRepository.create({
            name,
            email,
            password: hashedPassword,
            role: role || "user",
        });

        const savedUser = await userRepository.save(newUser);
        const { password: _, ...userData } = savedUser;
        res.status(201).json({ message: "User created successfully by authorized role", user: userData });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ==========================================
// 3. تسجيل الدخول (Login)
// ==========================================
app.post("/login", validate(loginSchema), async (req, res) => {
    try {
        const { email, password } = req.body;
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await comparePasswords(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        const { password: _, ...userData } = user;
        res.json({ message: "Login successful", token, user: userData });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ==========================================
// 4. بيانات المستخدم الحالي (Auth Me)
// ==========================================
app.get("/auth/me", authMiddleware, async (req, res) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({
            where: { id: req.user.userId },
            relations: { posts: true }, // جلب المقالات المرتبطة
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { password: _, ...userData } = user;
        res.json(userData);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// =======================================================
// 5. حذف مستخدم (صلاحية: admin فقط)
// =======================================================
app.delete("/users/:id", authMiddleware, requireRole("admin"), async (req, res) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const { id } = req.params;

        const user = await userRepository.findOne({ where: { id: parseInt(id, 10) } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await userRepository.remove(user);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// =======================================================
// 6. إضافة منشور جديد (صلاحية: user فقط)
// =======================================================
app.post("/posts", authMiddleware, requireRole("user"), validate(postSchema), async (req, res) => {
    try {
        const { post_title, post_content } = req.body;
        const postRepository = AppDataSource.getRepository(Post);

        const newPost = postRepository.create({
            post_title,
            post_content,
            user: { id: req.user.userId },
        });

        const savedPost = await postRepository.save(newPost);
        res.status(201).json({ message: "Post created successfully", post: savedPost });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// =======================================================
// 7. حذف منشور (صلاحية: user فقط - المنشور الخاص به)
// =======================================================
app.delete("/posts/:id", authMiddleware, requireRole("user"), async (req, res) => {
    try {
        const { id } = req.params;
        const postRepository = AppDataSource.getRepository(Post);

        const post = await postRepository.findOne({
            where: { id: parseInt(id, 10), user: { id: req.user.userId } },
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found or you are not authorized to delete it" });
        }

        await postRepository.remove(post);
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ==========================================
// 8. جلب جميع منشورات المستخدم الحالي
// ==========================================
app.get("/posts", authMiddleware, async (req, res) => {
    try {
        const postRepository = AppDataSource.getRepository(Post);
        const posts = await postRepository.find({
            where: { user: { id: req.user.userId } },
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// معالج الأخطاء العام
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "An unexpected error occurred", error: err.message });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

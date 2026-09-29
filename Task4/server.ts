import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";

const app = express();
app.use(express.json());

const port: number = 5000;
const dataFilePath: string = path.join(__dirname, "node.json");

// تعريف شكل البيانات (Data Model Interface)
export interface UserItem {
    id: number;
    title: string;
    body: string;
}

// واجهات لبيانات الطلبات (Request DTOs)
export interface CreateUserDto {
    title: string;
    body?: string;
}

export interface UpdateUserDto {
    title?: string;
    body?: string;
}

// دالة مساعدة للتحقق من أن المعرف id رقم صحيح موجب
function isValidId(id: string): boolean {
    const num = Number(id);
    return Number.isInteger(num) && num > 0;
}

// دالة مساعدة لقراءة البيانات مع تحديد نوع الإرجاع UserItem[]
function readData(): UserItem[] {
    try {
        if (!fs.existsSync(dataFilePath)) {
            fs.writeFileSync(dataFilePath, JSON.stringify([]));
        }
        const data = fs.readFileSync(dataFilePath, "utf8");
        return JSON.parse(data || "[]") as UserItem[];
    } catch (error) {
        console.error("Error reading the file:", error);
        return [];
    }
}

// دالة مساعدة لكتابة البيانات
function writeData(data: UserItem[]): void {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
    } catch (error) {
        console.error("Error while writing to the file:", error);
    }
}

app.get("/", (_req: Request, res: Response) => {
    res.send("Hello World");
});

// 1. GET - جلب جميع العناصر
app.get("/api/users", (_req: Request, res: Response) => {
    const users: UserItem[] = readData();
    res.json(users);
});

// GET - جلب عنصر محدد بالـ id
app.get("/api/users/:id", (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;

    // 1. التحقق في وقت التشغيل (Runtime Validation)
    if (!isValidId(id)) {
        return res.status(400).json({ error: "Invalid ID; must be an integer. (Invalid ID, must be an integer)." });
    }

    const users: UserItem[] = readData();
    const userId: number = parseInt(id, 10);
    const user = users.find((u: UserItem) => u.id === userId);

    if (!user) {
        return res.status(404).json({ error: "User not found. (User not found)." });
    }

    res.json(user);
});

// 2. POST - إضافة عنصر جديد مع التحقق من الأنواع والبيانات
app.post("/api/users", (req: Request<{}, {}, CreateUserDto>, res: Response) => {
    const { title, body } = req.body;

    // أ) التحقق من وجود العنوان ونوعه
    if (!title || typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({ 
            error: "حقل title مطلوب ويجب أن يكون نصاً غير فارغ (title is required and must be a non-empty string)." 
        });
    }

    // ب) التحقق من حقل المحتوى إذا تم إرساله
    if (body !== undefined && typeof body !== "string") {
        return res.status(400).json({ 
            error: "حقل body يجب أن يكون نصاً (body must be a string)." 
        });
    }

    const items: UserItem[] = readData();
    const newItem: UserItem = {
        id: items.length > 0 ? Math.max(...items.map((u: UserItem) => u.id)) + 1 : 1,
        title: title.trim(),
        body: body !== undefined ? body.trim() : ""
    };

    items.push(newItem);
    writeData(items);

    res.status(201).json(newItem);
});

// 3. PUT - تعديل عنصر موجود
app.put("/api/users/:id", (req: Request<{ id: string }, {}, UpdateUserDto>, res: Response) => {
    const { id } = req.params;

    // 1. التحقق من الـ id
    if (!isValidId(id)) {
        return res.status(400).json({ error: "معرف غير صالح (Invalid ID)." });
    }

    const itemId: number = parseInt(id, 10);
    const { title, body } = req.body;

    // 2. التحقق من إرسال حقل واحد على الأقل
    if (title === undefined && body === undefined) {
        return res.status(400).json({ 
            error: "يجب إرسال title أو body للتعديل (At least title or body must be provided)." 
        });
    }

    // 3. التحقق من نوع title إذا وُجد
    if (title !== undefined && (typeof title !== "string" || title.trim() === "")) {
        return res.status(400).json({ 
            error: "حقل title يجب أن يكون نصاً غير فارغ (title must be a non-empty string)." 
        });
    }

    // 4. التحقق من نوع body إذا وُجد
    if (body !== undefined && typeof body !== "string") {
        return res.status(400).json({ 
            error: "حقل body يجب أن يكون نصاً (body must be a string)." 
        });
    }

    const items: UserItem[] = readData();
    const itemIndex: number = items.findIndex((u: UserItem) => u.id === itemId);

    if (itemIndex === -1) {
        return res.status(404).json({ error: "العنصر غير موجود (Item not found)." });
    }

    if (title !== undefined) items[itemIndex].title = title.trim();
    if (body !== undefined) items[itemIndex].body = body.trim();
    writeData(items);

    res.json({ message: "تم تحديث البيانات بنجاح (Data updated successfully).", user: items[itemIndex] });
});

// 4. DELETE - حذف عنصر بواسطة الـ id
app.delete("/api/users/:id", (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;

    if (!isValidId(id)) {
        return res.status(400).json({ error: "معرف غير صالح (Invalid ID)." });
    }

    const userId: number = parseInt(id, 10);
    const users: UserItem[] = readData();
    const userIndex: number = users.findIndex((u: UserItem) => u.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ error: "المستخدم غير موجود (User not found)." });
    }

    const deletedUser: UserItem = users.splice(userIndex, 1)[0];
    writeData(users);

    res.json({ message: "تم حذف المستخدم بنجاح (User deleted successfully).", user: deletedUser });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

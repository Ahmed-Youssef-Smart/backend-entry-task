const AppDataSource = require("../config/db");
const { UserSchema } = require("../entities/User");

class UserRepository {
    constructor() {
        this.repo = AppDataSource.getRepository(UserSchema);
    }

    // جلب جميع المستخدمين مع الملاحظات المرتبطة بهم
    async findAll() {
        return await this.repo.find({
            relations: ["notes"],
            select: ["id", "name", "email", "role", "createdAt", "updatedAt"],
        });
    }

    // البحث عن مستخدم بواسطة الـ ID مع جلب ملاحظاته
    async findById(id) {
        return await this.repo.findOne({
            where: { id: parseInt(id, 10) },
            relations: ["notes"],
        });
    }

    // البحث عن مستخدم عبر البريد الإلكتروني (مهم لعمليات التوثيق وتسجيل الدخول)
    async findByEmail(email) {
        return await this.repo.findOne({
            where: { email: email.toLowerCase().trim() },
        });
    }

    // إنشاء مستخدم جديد
    async create(userData) {
        const user = this.repo.create({
            ...userData,
            email: userData.email.toLowerCase().trim(),
        });
        return await this.repo.save(user);
    }

    // تحديث بيانات المستخدم
    async update(id, userData) {
        if (userData.email) {
            userData.email = userData.email.toLowerCase().trim();
        }
        await this.repo.update({ id: parseInt(id, 10) }, userData);
        return await this.findById(id);
    }

    // حذف مستخدم
    async delete(id) {
        const result = await this.repo.delete({ id: parseInt(id, 10) });
        return result.affected > 0;
    }
}

module.exports = new UserRepository();

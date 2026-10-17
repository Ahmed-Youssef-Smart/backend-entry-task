const AppDataSource = require("../config/db");
const { NoteSchema } = require("../entities/Note");

class NoteRepository {
    constructor() {
        this.repo = AppDataSource.getRepository(NoteSchema);
    }

    async findAll() {
        return await this.repo.find({ relations: ["user"] });
    }

async findByUserId(userId) {
    return await this.repo.find({
        where: { user: { id: userId } } // أو حسب بنية الـ Schema لديك: { userId }
    });
}


    async findById(id) {
        return await this.repo.findOne({
            where: { id: parseInt(id, 10) },
            relations: ["user"],
        });
    }

    async create(noteData) {
        const note = this.repo.create(noteData);
        return await this.repo.save(note);
    }

    async update(id, noteData) {
        await this.repo.update({ id: parseInt(id, 10) }, noteData);
        return await this.findById(id);
    }

    async delete(id) {
        const result = await this.repo.delete({ id: parseInt(id, 10) });
        return result.affected > 0;
    }
}

module.exports = new NoteRepository();

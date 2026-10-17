const AppDataSource = require("../config/db");
const { Note, NoteSchema } = require("../entities/Note");

class NoteService {
    constructor(noteRepository) {
        // استخدام الـ Repository الممرر أو الافتراضي
        this.noteRepository = noteRepository;
    }

    async getAllNotes(user) {
        if (user.role === 'admin') {
            return await this.noteRepository.findAll(); // أو this.noteRepository.find() حسب الـ Mock
        }
        return await this.noteRepository.findByUserId(user.id);
    }

    async getNoteById(id) {
        // تأكد من استدعاء findById من الـ noteRepository
        const note = await this.noteRepository.findById(id);
        if (!note) {
            const error = new Error("Note not found");
            error.statusCode = 404;
            throw error;
        }
        return note;
    }

    async createNote(noteData, userId) {
        return await this.noteRepository.create({
            ...noteData,
            userId
        });
    }

    async deleteNote(id, userId, isAdmin) {
        const note = await this.getNoteById(id);
        
        if (!isAdmin && note.userId !== userId) {
            const error = new Error("Unauthorized to delete this note");
            error.statusCode = 403;
            throw error;
        }

        return await this.noteRepository.delete(id);
    }

    async getNotesByUserId(targetUserId, currentUser) {
        if (!currentUser.isAdmin && currentUser.id !== targetUserId) {
            const error = new Error("Forbidden");
            error.statusCode = 403;
            throw error;
        }
        return await this.noteRepository.findByUserId(targetUserId);
    }
}

module.exports = NoteService;

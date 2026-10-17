const noteService = require("../services/note.service");

class NoteController {
    constructor() {
        this.noteService = noteService;
        // Bind methods to maintain `this` context
        this.getAll = this.getAll.bind(this);
        this.getByUserId = this.getByUserId.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async getAll(req, res) {
        try {
            const isAdmin = req.user.role === "admin";
            const notes = await this.noteService.getAllNotes(req.user.id, isAdmin);
            res.json({ status: "success", data: notes });
        } catch (error) {
            res.status(error.statusCode || 500).json({ status: "error", message: error.message });
        }
    }

    // الدالة المسؤولة عن عرض ملاحظات مستخدم معين
    async getByUserId(req, res) {
        try {
            const isAdmin = req.user.role === "admin";
            const targetUserId = req.params.userId;
            const notes = await this.noteService.getNotesByUserId(targetUserId, req.user.id, isAdmin);
            res.json({ status: "success", data: notes });
        } catch (error) {
            res.status(error.statusCode || 500).json({ status: "error", message: error.message });
        }
    }

    async getById(req, res) {
        try {
            const isAdmin = req.user.role === "admin";
            const note = await this.noteService.getNoteById(req.params.id, req.user.id, isAdmin);
            if (!note) {
                return res.status(404).json({ status: "error", message: "Note not found" });
            }
            res.json({ status: "success", data: note });
        } catch (error) {
            res.status(error.statusCode || 500).json({ status: "error", message: error.message });
        }
    }

    async create(req, res) {
        try {
            const note = await this.noteService.createNote(req.body, req.user.id);
            res.status(201).json({ status: "success", data: note });
        } catch (error) {
            res.status(error.statusCode || 500).json({ status: "error", message: error.message });
        }
    }

    async update(req, res) {
        try {
            const isAdmin = req.user.role === "admin";
            const updatedNote = await this.noteService.updateNote(req.params.id, req.body, req.user.id, isAdmin);
            if (!updatedNote) {
                return res.status(404).json({ status: "error", message: "Note not found or unauthorized" });
            }
            res.json({ status: "success", data: updatedNote });
        } catch (error) {
            res.status(error.statusCode || 500).json({ status: "error", message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const isAdmin = req.user.role === "admin";
            const deleted = await this.noteService.deleteNote(req.params.id, req.user.id, isAdmin);
            if (!deleted) {
                return res.status(404).json({ status: "error", message: "Note not found or unauthorized" });
            }
            res.json({ status: "success", message: "Note deleted successfully" });
        } catch (error) {
            res.status(error.statusCode || 500).json({ status: "error", message: error.message });
        }
    }
}

module.exports = new NoteController();
//const jest= require('jest-mock');
// عزل طبقة الـ Repository بالكامل (Mocking)
jest.mock("../../repositories/note.repository");

const noteRepository = require("../../repositories/note.repository");
const NoteService = require('../../services/note.service');

describe('NoteService - Unit Tests', () => {
    let noteService;
    let mockNoteRepository;

    beforeEach(() => {
        // إنشاء Mock لجميع دوال الـ Repository
        mockNoteRepository = {
            find: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            findByUserId: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
        };

        // تمرير الـ Mock للخدمة
        noteService = new NoteService(mockNoteRepository);
    });

    describe('getAllNotes', () => {
        it('يجب أن يجلب جميع الملاحظات إذا كان المستخدم Admin', async () => {
            const mockNotes = [{ id: 1, title: 'Note 1' }];
            // إذا كانت الخدمة تستدعي find أو findAll:
            mockNoteRepository.find.mockResolvedValue(mockNotes);
            mockNoteRepository.findAll.mockResolvedValue(mockNotes);

            const result = await noteService.getAllNotes({ id: 1, role: 'admin' });
            expect(result).toEqual(mockNotes);
        });

        it('يجب أن يجلب ملاحظات المستخدم فقط إذا لم يكن Admin', async () => {
            const mockNotes = [{ id: 2, title: 'User Note' }];
            mockNoteRepository.findByUserId.mockResolvedValue(mockNotes);

            const result = await noteService.getAllNotes({ id: 2, role: 'user' });
            expect(result).toEqual(mockNotes);
            expect(mockNoteRepository.findByUserId).toHaveBeenCalledWith(2);
        });
    });

    describe('getNotesByUserId', () => {
        it('يجب أن يسمح بجلب الملاحظات إذا كان المستخدم نفسه', async () => {
            const mockNotes = [{ id: 1 }];
            mockNoteRepository.findByUserId.mockResolvedValue(mockNotes);

            const result = await noteService.getNotesByUserId(10, { id: 10, isAdmin: false });
            expect(result).toEqual(mockNotes);
            expect(mockNoteRepository.findByUserId).toHaveBeenCalledWith(10);
        });

        it('يجب أن يسمح للـ Admin بجلب ملاحظات أي مستخدم', async () => {
            const mockNotes = [{ id: 2 }];
            mockNoteRepository.findByUserId.mockResolvedValue(mockNotes);

            const result = await noteService.getNotesByUserId(10, { id: 1, isAdmin: true });
            expect(result).toEqual(mockNotes);
            expect(mockNoteRepository.findByUserId).toHaveBeenCalledWith(10);
        });
    });

    describe('createNote', () => {
        it('يجب أن ينشئ ملاحظة ويربطها بـ userId الخاص بالمستخدم', async () => {
            const newNote = { title: 'New', content: 'Test' };
            const createdNote = { id: 1, ...newNote, userId: 10 };
            mockNoteRepository.create.mockResolvedValue(createdNote);

            const result = await noteService.createNote(newNote, 10);
            expect(result).toEqual(createdNote);
            expect(mockNoteRepository.create).toHaveBeenCalledWith({ ...newNote, userId: 10 });
        });
    });

    describe('deleteNote', () => {
        it('يجب أن يرمي خطأ 403 إذا حاول مستخدم حذف ملاحظة لا يملكها', async () => {
            mockNoteRepository.findById.mockResolvedValue({ id: 5, userId: 99 });

            await expect(noteService.deleteNote(5, 10, false)).rejects.toThrow(
                "Unauthorized to delete this note"
            );
            expect(mockNoteRepository.delete).not.toHaveBeenCalled();
        });

        it('يجب أن يحذف الملاحظة بنجاح إذا كان صاحبها', async () => {
            mockNoteRepository.findById.mockResolvedValue({ id: 5, userId: 10 });
            mockNoteRepository.delete.mockResolvedValue(true);

            await noteService.deleteNote(5, 10, false);
            expect(mockNoteRepository.delete).toHaveBeenCalledWith(5);
        });
    });
});


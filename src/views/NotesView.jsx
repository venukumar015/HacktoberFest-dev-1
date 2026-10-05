import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Pin,
  Trash2,
  Edit2,
  Copy,
  Tag,
  BookMarked,
  Check
} from 'lucide-react';
import { useStudyBuddy } from '../context/StudyBuddyContext';
import { Modal } from '../components/common/Modal';

export const NotesView = () => {
  const { notes, addNote, updateNote, deleteNote, togglePinNote, showToast } = useStudyBuddy();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteForm, setNoteForm] = useState({
    title: '',
    subject: 'Computer Science',
    tag: 'Cheatsheet',
    content: '',
    color: '#6366f1'
  });

  // Extract all distinct tags/subjects
  const allTags = Array.from(new Set(notes.map(n => n.subject || n.tag).filter(Boolean)));

  const handleOpenModal = (note = null) => {
    if (note) {
      setEditingNote(note);
      setNoteForm({
        title: note.title,
        subject: note.subject || 'General',
        tag: note.tag || 'Study Note',
        content: note.content || '',
        color: note.color || '#6366f1'
      });
    } else {
      setEditingNote(null);
      setNoteForm({
        title: '',
        subject: 'Computer Science',
        tag: 'Cheatsheet',
        content: '',
        color: '#6366f1'
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveNote = (e) => {
    e.preventDefault();
    if (!noteForm.title.trim()) return;

    if (editingNote) {
      updateNote(editingNote.id, noteForm);
    } else {
      addNote(noteForm);
    }
    setIsModalOpen(false);
  };

  const handleCopyNote = (note) => {
    navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
    setCopiedId(note.id);
    showToast('Note copied to clipboard!', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const insertMarkdown = (prefix, suffix = '') => {
    setNoteForm(prev => ({
      ...prev,
      content: prev.content + `${prefix}Your Text${suffix}`
    }));
  };

  // Filtered Notes with search & tag selection
  const filteredNotes = notes
    .filter(n => {
      const matchSearch =
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.subject && n.subject.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchTag =
        selectedTag === 'all' || n.subject === selectedTag || n.tag === selectedTag;
      return matchSearch && matchTag;
    })
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  // Simple Markdown text renderer
  const renderMarkdown = (text) => {
    if (!text) return null;
    const lines = text.split('\n');

    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h4 key={idx} style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0.6rem 0 0.3rem' }}>{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0.8rem 0 0.4rem' }}>{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('# ')) {
        return <h2 key={idx} style={{ fontSize: '1.15rem', fontWeight: 800, margin: '1rem 0 0.5rem' }}>{line.replace('# ', '')}</h2>;
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={idx} style={{ marginLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {line.replace(/^[-*]\s+/, '')}
          </li>
        );
      }
      if (line.startsWith('> ')) {
        return (
          <blockquote
            key={idx}
            style={{
              borderLeft: '3px solid var(--accent-primary)',
              paddingLeft: '0.75rem',
              margin: '0.5rem 0',
              fontStyle: 'italic',
              color: 'var(--text-muted)',
              fontSize: '0.85rem'
            }}
          >
            {line.replace('> ', '')}
          </blockquote>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} style={{ height: '0.5rem' }} />;
      }
      return (
        <p key={idx} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0.2rem 0' }}>
          {line}
        </p>
      );
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Search & Actions Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Study Notes & Cheatsheets ({notes.length})</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Capture high-yield summaries, formulas, and concepts
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={16} />
          <span>New Note</span>
        </button>
      </div>

      {/* Search Bar & Tag Filter Pills */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ position: 'relative' }}>
          <Search
            size={18}
            style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Search notes by keyword, code, or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.75rem' }}
          />
        </div>

        {/* Tag pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${selectedTag === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedTag('all')}
          >
            All Subjects
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              className={`btn btn-sm ${selectedTag === tag ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid-3">
        {filteredNotes.map(note => (
          <div
            key={note.id}
            className="card card-hoverable"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderTop: `4px solid ${note.color || '#6366f1'}`,
              position: 'relative'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span className="badge badge-primary">{note.subject || 'General'}</span>
                <div style={{ display: 'flex', gap: '0.2rem' }}>
                  <button
                    className="btn-icon"
                    onClick={() => togglePinNote(note.id)}
                    title={note.pinned ? 'Unpin note' : 'Pin note'}
                    style={{ color: note.pinned ? 'var(--accent-primary)' : 'var(--text-muted)', padding: '4px' }}
                  >
                    <Pin size={15} fill={note.pinned ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => handleCopyNote(note)}
                    title="Copy note"
                    style={{ padding: '4px' }}
                  >
                    {copiedId === note.id ? <Check size={15} color="var(--color-success)" /> : <Copy size={15} />}
                  </button>
                </div>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                {note.title}
              </h3>

              <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '1rem', paddingRight: '0.25rem' }}>
                {renderMarkdown(note.content)}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>

              <div style={{ display: 'flex', gap: '0.3rem' }}>
                <button className="btn-icon" onClick={() => handleOpenModal(note)} title="Edit Note" style={{ padding: '4px' }}>
                  <Edit2 size={15} />
                </button>
                <button className="btn-icon" onClick={() => deleteNote(note.id)} title="Delete Note" style={{ padding: '4px' }}>
                  <Trash2 size={15} color="var(--color-danger)" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredNotes.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
            No study notes found matching your search.
          </div>
        )}
      </div>

      {/* Note Editor Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingNote ? 'Edit Study Note' : 'Create Study Note'}
        maxWidth="680px"
      >
        <form onSubmit={handleSaveNote}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Note Title</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Active Recall & Spaced Repetition Cheatsheet"
                value={noteForm.title}
                onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Computer Science"
                  value={noteForm.subject}
                  onChange={(e) => setNoteForm({ ...noteForm, subject: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tag / Keyword</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Algorithms"
                  value={noteForm.tag}
                  onChange={(e) => setNoteForm({ ...noteForm, tag: e.target.value })}
                />
              </div>
            </div>

            {/* Quick Markdown Formatting Helper Toolbar */}
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => insertMarkdown('### ')}
              >
                H3
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => insertMarkdown('**', '**')}
              >
                Bold
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => insertMarkdown('- ')}
              >
                List
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => insertMarkdown('> ')}
              >
                Quote
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => insertMarkdown('`', '`')}
              >
                Code
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Note Content (Markdown supported)</label>
              <textarea
                className="form-textarea"
                style={{ minHeight: '180px' }}
                placeholder="Type your notes, takeaways, formulas, and insights..."
                value={noteForm.content}
                onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingNote ? 'Save Changes' : 'Save Note'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

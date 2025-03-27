'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Tag,
  Pin,
  Folder,
  Clock,
  Users,
  FileText,
  Image as ImageIcon,
  Mic,
  CheckSquare,
  History,
  ChevronDown,
  X,
} from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  folder?: string;
  isPinned: boolean;
  lastModified: string;
  sharedWith?: string[];
  checklist?: { text: string; completed: boolean; dueDate?: string }[];
  attachments?: { type: 'image' | 'file' | 'audio'; url: string; name: string }[];
  comments?: { id: string; text: string; author: string; timestamp: string }[];
  versions?: { content: string; timestamp: string }[];
}

const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Project Planning Notes',
    content: 'Key points for Q2 planning:\n- Review current metrics\n- Set new targets\n- Schedule team sync',
    tags: ['Planning', 'Work'],
    folder: 'Work',
    isPinned: true,
    lastModified: '2024-03-20T10:30:00',
    checklist: [
      { text: 'Review current metrics', completed: true },
      { text: 'Set new targets', completed: false, dueDate: '2024-03-25' },
      { text: 'Schedule team sync', completed: false },
    ],
  },
  {
    id: '2',
    title: 'Daily Journal',
    content: 'Today\'s reflections:\n1. Made progress on the dashboard\n2. Need to follow up with design team\n3. Ideas for new features',
    tags: ['Personal', 'Journal'],
    folder: 'Personal',
    isPinned: false,
    lastModified: '2024-03-20T15:45:00',
  },
];

const pastelColors = [
  '#FFF5E5', // peach
  '#E6F7FF', // light blue
  '#F9F0FF', // lavender
  '#F0FFF4', // mint green
  '#FFF0F5', // rose pink
];

const NoteCard = ({ note, onEdit }: { note: Note; onEdit: (note: Note) => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const completedCount = note.checklist?.filter(item => item.completed).length || 0;
  const totalCount = note.checklist?.length || 0;
  
  // Get a consistent color based on the note's ID
  const colorIndex = parseInt(note.id) % pastelColors.length;
  const backgroundColor = pastelColors[colorIndex];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.03 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onEdit(note)}
      className="group relative rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
      style={{ backgroundColor }}
    >
      {/* Title */}
      <h3 className="font-bold text-gray-900 text-lg mb-3 group-hover:text-blue-600 transition-colors line-clamp-1">
        {note.title}
      </h3>

      {/* Content Preview */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-4">
        {note.content}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {note.tags.map(tag => (
          <span
            key={tag}
            className="px-2 py-0.5 text-xs rounded-full bg-white/80 text-gray-700"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Checklist Progress */}
      {note.checklist && (
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <CheckSquare size={14} />
          <span>{completedCount}/{totalCount} completed</span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <Clock size={12} />
          <span>Last edited {new Date(note.lastModified).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          {note.sharedWith && (
            <div className="flex items-center gap-1">
              <Users size={12} />
              <span>{note.sharedWith.length}</span>
            </div>
          )}
          {note.isPinned && (
            <Pin size={12} className="text-yellow-500" />
          )}
        </div>
      </div>

      {/* Hover Actions */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-3 right-3 flex items-center gap-1 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm"
          >
            <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <Pin size={14} className="text-gray-500" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <Tag size={14} className="text-gray-500" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const NotesEditor = ({ onSave, onCancel }: { onSave: (note: Partial<Note>) => void; onCancel: () => void }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave({
        title,
        content,
        tags,
        isPinned: false,
        lastModified: new Date().toISOString(),
      });
      setTitle('');
      setContent('');
      setTags([]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-8"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          className="w-full text-xl font-bold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 p-0"
          autoFocus
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing..."
          className="w-full text-base text-gray-600 bg-transparent border-none focus:outline-none focus:ring-0 p-0 resize-none min-h-[100px]"
        />
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-1 text-sm rounded-full bg-[#D1E8FF] text-blue-700 hover:bg-[#C0E0FF] transition-colors"
            >
              Add tags
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Save Note
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default function NotesView() {
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showTagSidebar, setShowTagSidebar] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddNote = (note: Partial<Note>) => {
    if (!note.title) return; // Don't create note without title
    
    const newNote: Note = {
      id: Date.now().toString(),
      title: note.title,
      content: note.content || '',
      tags: note.tags || [],
      isPinned: false,
      lastModified: new Date().toISOString(),
      folder: note.folder,
      sharedWith: note.sharedWith,
      checklist: note.checklist,
      attachments: note.attachments,
      comments: note.comments,
      versions: note.versions,
    };
    setNotes([newNote, ...notes]);
    setIsEditing(false);
  };

  const handleEditNote = (note: Note) => {
    // TODO: Implement rich text editor modal
    console.log('Editing note:', note);
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = !selectedFolder || note.folder === selectedFolder;
    const matchesTag = !selectedTag || note.tags.includes(selectedTag);
    return matchesSearch && matchesFolder && matchesTag;
  });

  return (
    <div className="min-h-screen bg-[#F7F7F7] pt-8">
      {/* Main Content */}
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Toolbar */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowTagSidebar(!showTagSidebar)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Tag size={20} />
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            New Note
          </button>
        </div>

        {/* Notes Editor */}
        <AnimatePresence>
          {isEditing && (
            <NotesEditor
              onSave={handleAddNote}
              onCancel={() => setIsEditing(false)}
            />
          )}
        </AnimatePresence>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredNotes.map(note => (
              <NoteCard key={note.id} note={note} onEdit={handleEditNote} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Tag Sidebar */}
      <AnimatePresence>
        {showTagSidebar && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Organize</h2>
                <button
                  onClick={() => setShowTagSidebar(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              {/* Add folder and tag management here */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 
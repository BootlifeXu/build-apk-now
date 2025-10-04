import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, StickyNote } from "lucide-react";
import NoteCard from "@/components/NoteCard";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";
import ColorPicker from "@/components/ColorPicker";
import TagInput from "@/components/TagInput";
import { useToast } from "@/hooks/use-toast";

interface Note {
  id: string;
  content: string;
  timestamp: number;
  isPinned?: boolean;
  isFavorite?: boolean;
  color?: string;
  tags?: string[];
  isArchived?: boolean;
}

const Index = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [newNoteTags, setNewNoteTags] = useState<string[]>([]);
  const [newNoteColor, setNewNoteColor] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const { toast } = useToast();

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    notes.forEach((note) => {
      note.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [notes]);

  // Filter and sort notes
  const filteredNotes = useMemo(() => {
    let filtered = notes.filter((note) => {
      // Search filter
      if (searchQuery && !note.content.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Tag filter
      if (selectedTags.length > 0) {
        const noteTags = note.tags || [];
        if (!selectedTags.some((tag) => noteTags.includes(tag))) {
          return false;
        }
      }

      // Archive filter
      if (!showArchived && note.isArchived) {
        return false;
      }

      return true;
    });

    // Sort: pinned first, then favorites, then by timestamp
    filtered.sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
      return b.timestamp - a.timestamp;
    });

    return filtered;
  }, [notes, searchQuery, selectedTags, showArchived]);

  const addNote = () => {
    if (!newNote.trim()) {
      toast({
        title: "Empty note",
        description: "Please write something before adding a note",
        variant: "destructive",
      });
      return;
    }

    const note: Note = {
      id: Date.now().toString(),
      content: newNote.trim(),
      timestamp: Date.now(),
      color: newNoteColor,
      tags: newNoteTags,
      isPinned: false,
      isFavorite: false,
      isArchived: false,
    };

    setNotes([note, ...notes]);
    setNewNote("");
    setNewNoteTags([]);
    setNewNoteColor("default");

    toast({
      title: "Note added",
      description: "Your note has been saved successfully",
    });
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, ...updates } : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));

    toast({
      title: "Note deleted",
      description: "Your note has been removed",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      addNote();
    }
  };

  const handleShare = async (content: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          text: content,
        });
        toast({
          title: "Note shared",
          description: "Your note was shared successfully",
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          toast({
            title: "Share failed",
            description: "Could not share the note",
            variant: "destructive",
          });
        }
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(content);
      toast({
        title: "Copied to clipboard",
        description: "Note content has been copied",
      });
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(notes, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `notes-export-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Notes exported",
      description: "Your notes have been downloaded as JSON",
    });
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
            <StickyNote className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notes</h1>
            <p className="text-sm text-muted-foreground">
              {filteredNotes.length} of {notes.filter((n) => !n.isArchived).length}{" "}
              notes
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Filters */}
        <div className="mb-6">
          <FilterBar
            selectedTags={selectedTags}
            allTags={allTags}
            showArchived={showArchived}
            onTagToggle={handleTagToggle}
            onShowArchivedToggle={() => setShowArchived(!showArchived)}
            onExport={handleExport}
          />
        </div>

        {/* Add Note Section */}
        <div className="mb-8 space-y-3">
          <Textarea
            placeholder="Write a note... (Cmd/Ctrl + Enter to save)"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={handleKeyPress}
            className="min-h-[120px] resize-none bg-card border-border focus:border-primary transition-colors"
          />
          
          <TagInput tags={newNoteTags} onTagsChange={setNewNoteTags} />
          
          <ColorPicker
            selectedColor={newNoteColor}
            onColorSelect={setNewNoteColor}
          />

          <Button
            onClick={addNote}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Note
          </Button>
        </div>

        {/* Notes List */}
        <div className="space-y-3">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <StickyNote className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                {notes.length === 0
                  ? "No notes yet"
                  : searchQuery || selectedTags.length > 0
                  ? "No notes match your filters"
                  : "No notes to show"}
              </h3>
              <p className="text-muted-foreground">
                {notes.length === 0
                  ? "Start writing your first note above"
                  : "Try adjusting your search or filters"}
              </p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                {...note}
                onDelete={deleteNote}
                onUpdate={updateNote}
                onShare={handleShare}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, StickyNote } from "lucide-react";
import NoteCard from "@/components/NoteCard";
import { useToast } from "@/hooks/use-toast";

interface Note {
  id: string;
  content: string;
  timestamp: number;
}

const Index = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
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
    if (notes.length > 0) {
      localStorage.setItem("notes", JSON.stringify(notes));
    }
  }, [notes]);

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
    };

    setNotes([note, ...notes]);
    setNewNote("");
    
    toast({
      title: "Note added",
      description: "Your note has been saved successfully",
    });
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
            <StickyNote className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notes</h1>
            <p className="text-sm text-muted-foreground">
              {notes.length} {notes.length === 1 ? "note" : "notes"}
            </p>
          </div>
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
          {notes.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <StickyNote className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                No notes yet
              </h3>
              <p className="text-muted-foreground">
                Start writing your first note above
              </p>
            </div>
          ) : (
            notes.map((note) => (
              <NoteCard
                key={note.id}
                id={note.id}
                content={note.content}
                timestamp={note.timestamp}
                onDelete={deleteNote}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;

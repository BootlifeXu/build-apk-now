import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Trash2, Pin, Star, Archive, Edit2, Save, X, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface NoteCardProps {
  id: string;
  content: string;
  timestamp: number;
  isPinned?: boolean;
  isFavorite?: boolean;
  color?: string;
  tags?: string[];
  isArchived?: boolean;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<NoteCardProps>) => void;
  onShare?: (content: string) => void;
}

const NOTE_COLORS = [
  { name: "default", class: "bg-card" },
  { name: "yellow", class: "bg-yellow-500/10" },
  { name: "green", class: "bg-green-500/10" },
  { name: "blue", class: "bg-blue-500/10" },
  { name: "purple", class: "bg-purple-500/10" },
  { name: "pink", class: "bg-pink-500/10" },
];

const NoteCard = ({
  id,
  content,
  timestamp,
  isPinned = false,
  isFavorite = false,
  color = "default",
  tags = [],
  isArchived = false,
  onDelete,
  onUpdate,
  onShare,
}: NoteCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const colorClass = NOTE_COLORS.find((c) => c.name === color)?.class || NOTE_COLORS[0].class;

  const handleSave = () => {
    if (editedContent.trim()) {
      onUpdate(id, { content: editedContent.trim() });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedContent(content);
    setIsEditing(false);
  };

  return (
    <Card
      className={cn(
        "p-4 border-border transition-all duration-200 group relative",
        colorClass,
        isPinned && "ring-2 ring-primary/30",
        isArchived && "opacity-60"
      )}
    >
      {/* Pin indicator */}
      {isPinned && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <Pin className="h-4 w-4 text-primary-foreground" />
        </div>
      )}

      <div className="space-y-3">
        {/* Content or Edit Mode */}
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[100px] resize-none"
              autoFocus
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-foreground whitespace-pre-wrap break-words leading-relaxed">
            {content}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Footer with metadata and actions */}
        <div className="flex justify-between items-center pt-2 border-t border-border/50">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{formatDate(timestamp)}</span>
            <span>•</span>
            <span>{getWordCount(content)} words</span>
            <span>•</span>
            <span>{content.length} chars</span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!isEditing && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onUpdate(id, { isFavorite: !isFavorite })}
                >
                  <Star
                    className={cn(
                      "h-4 w-4",
                      isFavorite && "fill-yellow-500 text-yellow-500"
                    )}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onUpdate(id, { isPinned: !isPinned })}
                >
                  <Pin
                    className={cn("h-4 w-4", isPinned && "fill-primary text-primary")}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                {onShare && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onShare(content)}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onUpdate(id, { isArchived: !isArchived })}
                >
                  <Archive className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => onDelete(id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NoteCard;
export { NOTE_COLORS };

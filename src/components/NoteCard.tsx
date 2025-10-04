import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface NoteCardProps {
  id: string;
  content: string;
  timestamp: number;
  onDelete: (id: string) => void;
}

const NoteCard = ({ id, content, timestamp, onDelete }: NoteCardProps) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    }
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="p-4 bg-card border-border hover:border-primary/30 transition-all duration-200 group">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-foreground whitespace-pre-wrap break-words leading-relaxed">
            {content}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {formatDate(timestamp)}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default NoteCard;

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NOTE_COLORS } from "./NoteCard";

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const ColorPicker = ({ selectedColor, onColorSelect }: ColorPickerProps) => {
  return (
    <div className="flex gap-2 items-center">
      <span className="text-sm text-muted-foreground">Color:</span>
      <div className="flex gap-1">
        {NOTE_COLORS.map((color) => (
          <Button
            key={color.name}
            variant="outline"
            size="icon"
            className={cn(
              "h-8 w-8 rounded-full",
              color.class,
              selectedColor === color.name && "ring-2 ring-primary"
            )}
            onClick={() => onColorSelect(color.name)}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;

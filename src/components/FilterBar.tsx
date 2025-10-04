import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, Download, Archive } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FilterBarProps {
  selectedTags: string[];
  allTags: string[];
  showArchived: boolean;
  onTagToggle: (tag: string) => void;
  onShowArchivedToggle: () => void;
  onExport: () => void;
}

const FilterBar = ({
  selectedTags,
  allTags,
  showArchived,
  onTagToggle,
  onShowArchivedToggle,
  onExport,
}: FilterBarProps) => {
  return (
    <div className="flex gap-2 flex-wrap items-center">
      {/* Tag Filter */}
      {allTags.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Tags
              {selectedTags.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  {selectedTags.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-50 bg-popover">
            {allTags.map((tag) => (
              <DropdownMenuItem
                key={tag}
                onClick={() => onTagToggle(tag)}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-4 w-4 rounded border ${
                      selectedTags.includes(tag)
                        ? "bg-primary border-primary"
                        : "border-muted-foreground"
                    }`}
                  />
                  #{tag}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Archive Toggle */}
      <Button
        variant={showArchived ? "default" : "outline"}
        size="sm"
        onClick={onShowArchivedToggle}
        className="gap-2"
      >
        <Archive className="h-4 w-4" />
        {showArchived ? "Hide Archived" : "Show Archived"}
      </Button>

      {/* Export */}
      <Button variant="outline" size="sm" onClick={onExport} className="gap-2 ml-auto">
        <Download className="h-4 w-4" />
        Export
      </Button>
    </div>
  );
};

export default FilterBar;

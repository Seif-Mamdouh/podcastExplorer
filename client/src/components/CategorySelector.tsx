import { Button } from "@/components/ui/button";

const CATEGORIES = [
  "Technology",
  "Business",
  "News",
  "Comedy",
  "Society",
  "Education",
  "Arts",
  "Music",
  "Games",
  "Sports"
] as const;

interface CategorySelectorProps {
  selected: string[];
  onSelect: (category: string) => void;
}

export function CategorySelector({ selected, onSelect }: CategorySelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 p-4">
      {CATEGORIES.map((category) => (
        <Button
          key={category}
          variant={selected.includes(category) ? "default" : "outline"}
          onClick={() => onSelect(category)}
          className="rounded-full"
        >
          {category}
        </Button>
      ))}
    </div>
  );
}

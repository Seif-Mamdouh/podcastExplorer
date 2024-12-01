import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PodcastGrid } from "../components/PodcastGrid";
import { PodcastPlayer } from "../components/PodcastPlayer";
import { CategorySelector } from "../components/CategorySelector";
import { PlaylistManager } from "../components/PlaylistManager";
import { usePodcasts } from "../lib/api";
import { Search } from "lucide-react";
import { useUser } from "../hooks/use-user";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { data: podcasts, isLoading } = usePodcasts(search);
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="h-[400px] bg-cover bg-center relative"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1463421585849-6b0acf2c9257)' }}
      >
        <div className="absolute inset-0 bg-black/60">
          <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Discover Your Next Favorite Podcast
            </h1>
            <p className="text-lg text-gray-200 mb-8">
              Welcome back, {user?.username}! What would you like to listen to today?
            </p>
            <div className="w-full max-w-md flex gap-2">
              <Input
                placeholder="Search podcasts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white/10 text-white placeholder:text-gray-400"
              />
              <Button size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">Browse Categories</h2>
          <PlaylistManager />
        </div>

        <CategorySelector
          selected={selectedCategories}
          onSelect={(category) => {
            setSelectedCategories(prev =>
              prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
            );
          }}
        />

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">
            {search ? 'Search Results' : 'Recommended for You'}
          </h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array(8).fill(0).map((_, i) => (
                <div
                  key={i}
                  className="h-72 bg-muted animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : (
            <PodcastGrid
              podcasts={podcasts || []}
              onPlay={() => {}}
              onAddToPlaylist={() => {}}
            />
          )}
        </div>
      </div>

      {/* Player */}
      <PodcastPlayer />
    </div>
  );
}

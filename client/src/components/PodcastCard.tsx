import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, PlayCircle, Plus } from "lucide-react";
import { type Podcast } from "../lib/api";

interface PodcastCardProps {
  podcast: Podcast;
  onPlay: (podcast: Podcast) => void;
  onAddToPlaylist: (podcast: Podcast) => void;
}

export function PodcastCard({ podcast, onPlay, onAddToPlaylist }: PodcastCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="relative p-0">
        <img 
          src={podcast.image} 
          alt={podcast.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onPlay(podcast)}
        >
          <PlayCircle className="h-6 w-6" />
        </Button>
      </CardHeader>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1">{podcast.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {podcast.description}
        </p>
      </CardContent>
      
      <CardFooter className="px-4 py-2 flex justify-between">
        <Button variant="ghost" size="sm">
          <Heart className="h-4 w-4 mr-1" />
          Like
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onAddToPlaylist(podcast)}>
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </CardFooter>
    </Card>
  );
}

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useCreatePlaylist } from "../lib/api";
import { useToast } from "@/hooks/use-toast";

export function PlaylistManager() {
  const [name, setName] = useState("");
  const { toast } = useToast();
  const createPlaylist = useCreatePlaylist();

  const handleCreate = async () => {
    try {
      await createPlaylist.mutateAsync({ name });
      toast({
        title: "Success",
        description: "Playlist created successfully",
      });
      setName("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create playlist",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Playlist
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Playlist</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Input
            placeholder="Playlist name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button 
            onClick={handleCreate}
            disabled={!name || createPlaylist.isPending}
          >
            Create Playlist
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_KEY = "your_listennotes_api_key"; // Should be moved to env
const API_BASE = "https://listen-api.listennotes.com/api/v2";

export interface Podcast {
  id: string;
  title: string;
  publisher: string;
  image: string;
  description: string;
}

export interface Episode {
  id: string;
  title: string;
  audio: string;
  duration: number;
  publishDate: string;
}

async function fetchPodcasts(query?: string): Promise<Podcast[]> {
  const endpoint = query 
    ? `/search?q=${encodeURIComponent(query)}&type=podcast`
    : `/best_podcasts`;
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'X-ListenAPI-Key': API_KEY }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch podcasts');
  }
  
  const data = await response.json();
  return data.podcasts || data.results;
}

export function usePodcasts(query?: string) {
  return useQuery({
    queryKey: ['podcasts', query],
    queryFn: () => fetchPodcasts(query),
  });
}

export function usePlaylist(id: number) {
  return useQuery({
    queryKey: ['playlist', id],
    queryFn: async () => {
      const response = await fetch(`/api/playlists/${id}`);
      if (!response.ok) throw new Error('Failed to fetch playlist');
      return response.json();
    }
  });
}

export function useCreatePlaylist() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { name: string, description?: string }) => {
      const response = await fetch('/api/playlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) throw new Error('Failed to create playlist');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    }
  });
}

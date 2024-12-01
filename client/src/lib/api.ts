import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Podcast {
  id: number;
  title: string;
  author: string;
  image: string;
  description: string;
  feedUrl: string;
}

export interface Episode {
  id: number;
  title: string;
  enclosureUrl: string;
  duration: number;
  datePublished: number;
  description: string;
}

async function fetchPodcasts(query?: string): Promise<Podcast[]> {
  const url = '/api/podcasts' + (query ? `?q=${encodeURIComponent(query)}` : '');
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch podcasts');
  }
  
  return response.json();
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

export async function fetchEpisodes(feedId: number): Promise<Episode[]> {
  const response = await fetch(`/api/podcasts/${feedId}/episodes`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch episodes');
  }
  
  return response.json();
}

export function useEpisodes(feedId: number) {
  return useQuery({
    queryKey: ['episodes', feedId],
    queryFn: () => fetchEpisodes(feedId),
    enabled: !!feedId,
  });
}
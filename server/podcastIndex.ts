import { createHash } from "crypto";

const API_KEY = process.env.PODCASTINDEX_API_KEY;
const API_SECRET = process.env.PODCASTINDEX_API_SECRET;
const API_BASE = "https://api.podcastindex.org/api/1.0";

// Generate required headers for PodcastIndex API
function generateHeaders() {
  const timestamp = Math.floor(Date.now() / 1000);
  const authHash = createHash('sha1')
    .update(`${API_KEY}${API_SECRET}${timestamp}`)
    .digest('hex');

  return {
    'User-Agent': 'PodcastDiscoveryApp/1.0',
    'X-Auth-Date': timestamp.toString(),
    'X-Auth-Key': API_KEY!,
    'Authorization': authHash,
  };
}

export async function searchPodcasts(query?: string) {
  const endpoint = query 
    ? `/search/byterm?q=${encodeURIComponent(query)}`
    : `/podcasts/trending`;
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: generateHeaders()
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch podcasts');
  }
  
  const data = await response.json();
  return data.feeds || data.items || [];
}

export async function getEpisodes(feedId: number) {
  const response = await fetch(`${API_BASE}/episodes/byfeedid?id=${feedId}`, {
    headers: generateHeaders()
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch episodes');
  }
  
  const data = await response.json();
  return data.items || [];
}

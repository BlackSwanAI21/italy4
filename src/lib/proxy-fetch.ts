// This is a simple proxy function to handle CORS issues
export async function fetchWithProxy(url: string): Promise<Response> {
  // Use a CORS proxy service
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
  
  try {
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch website content');
    }
    return response;
  } catch (error) {
    throw new Error('Failed to access website. Please check the URL and try again.');
  }
}
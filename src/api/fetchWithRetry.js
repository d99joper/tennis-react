export async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      return response;
    } catch (err) {
      if (attempt < retries) {
        await new Promise(res => setTimeout(res, delay * (attempt + 1))); // Exponential backoff
      } else {
        throw err;
      }
    }
  }
}
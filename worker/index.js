export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle API requests - proxy to your local tunnel
    if (url.pathname.startsWith('/api/')) {
      return await handleApiRequest(request, env);
    }
    
    // Serve static files
    return await env.ASSETS.fetch(request);
  },
};

async function handleApiRequest(request, env) {
  // Your tunnel URL (replace with your actual tunnel domain)
  const API_BASE = 'https://your-tunnel-id.trycloudflare.com';
  
  const url = new URL(request.url);
  const apiUrl = API_BASE + url.pathname + url.search;
  
  try {
    // Forward the request to your local AI service
    const response = await fetch(apiUrl, {
      method: request.method,
      headers: {
        ...Object.fromEntries(request.headers),
        'X-Forwarded-For': request.headers.get('CF-Connecting-IP') || '',
      },
      body: request.method !== 'GET' ? request.body : undefined,
    });
    
    // Return response with CORS headers
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'API service unavailable',
      message: error.message 
    }), {
      status: 503,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
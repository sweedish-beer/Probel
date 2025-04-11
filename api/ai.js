// api/ai.js
export default async function handler(req, res) {
    // Log whether we're receiving the API key (don't log the actual key!)
    console.log('API Key exists:', !!process.env.ANTHROPIC_API_KEY);
    
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    try {
      // Log the headers we're sending (mask the actual key)
      const apiKey = process.env.ANTHROPIC_API_KEY;
      console.log('Using API key (first 4 chars):', apiKey?.substring(0, 4));
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify(req.body)
      });
  
      // Detailed error handling
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Anthropic error response:', errorText);
        return res.status(response.status).json({ 
          error: 'API Error: ' + errorText
        });
      }
  
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      console.error('Error:', error.message);
      return res.status(500).json({ error: error.message });
    }
  }
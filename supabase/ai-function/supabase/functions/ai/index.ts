// Supabase Edge Function handler (TypeScript)
// This file is the entrypoint expected by the Supabase bundler.

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const prompt = body?.prompt || '';

  const HF_API_KEY = process.env.HF_API_KEY || '';
  const HF_MODEL = process.env.HF_MODEL || 'gpt2';

  if (!HF_API_KEY) {
    return new Response(JSON.stringify({ error: 'HF_API_KEY not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const hfRes = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    const text = await hfRes.text();
    // Try parse JSON, otherwise return raw text
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch (e) { data = null; }

    // Normalize output
    let out = '';
    if (data) {
      if (typeof data === 'string') out = data;
      else if (data.generated_text) out = data.generated_text;
      else if (data.text) out = data.text;
      else if (Array.isArray(data) && data[0]) {
        out = data[0].generated_text || data[0].text || JSON.stringify(data[0]);
      } else {
        out = JSON.stringify(data);
      }
    } else {
      out = text;
    }

    return new Response(JSON.stringify({ text: out }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    console.error('HF call failed:', err);
    return new Response(JSON.stringify({ error: 'inference_failed', detail: String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

// Supabase Edge Function: ai
// Deploy this function to Supabase Functions and set HF_API_KEY as a secret.
// It forwards the prompt to a Hugging Face Inference API (or any inference URL you prefer)

export default async function (req, res) {
  try {
    const body = await req.json();
    const prompt = body?.prompt || '';
    if (!prompt) return res.json({ error: 'missing prompt' }, { status: 400 });

    const HF_MODEL = process.env.HF_MODEL || 'gpt2';
    const HF_API_KEY = process.env.HF_API_KEY;
    if (!HF_API_KEY) {
      // No HF key — return a simple fallback
      return res.json({ text: `Dienst uitgevoerd zoals overeengekomen.` , fallback: true });
    }

    const hfUrl = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

    const hfRes = await fetch(hfUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 150 } }),
    });

    const text = await hfRes.text();
    let parsed = null;
    try { parsed = JSON.parse(text); } catch (e) { parsed = null; }

    let result = '';
    if (parsed) {
      result = parsed.generated_text || parsed[0]?.generated_text || parsed.results?.[0]?.text || JSON.stringify(parsed);
    } else {
      result = text;
    }

    return res.json({ text: (result || '').toString().trim() });
  } catch (err) {
    console.error('Supabase function error:', err);
    return res.json({ text: 'Dienst uitgevoerd zoals overeengekomen.', fallback: true, warning: 'function_error' });
  }
}

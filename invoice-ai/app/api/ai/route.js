import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log(
  "OPENAI KEY:",
  process.env.OPENAI_API_KEY ? "gevonden" : "ontbreekt"
);
console.log('SUPABASE_FUNCTION_URL:', process.env.SUPABASE_FUNCTION_URL ? 'set' : 'not-set');
console.log('SUPABASE ANON KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'gevonden' : 'ontbreekt');

function generateFallback(prompt) {
  if (!prompt || !prompt.toString().trim()) {
    return 'Dienst uitgevoerd zoals overeengekomen.';
  }
  const p = prompt.toString().trim();

  // Simple, safe Dutch fallback phrasing
  return (`Ontwikkeling en oplevering van ${p} — inclusief ontwerp, implementatie en optimalisatie voor een optimale gebruikerservaring.`).replace(/\s+/g, ' ').trim();
}

  async function callLocalLLM(prompt) {
    const url = process.env.LOCAL_LLM_URL;
    if (!url) return null;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, max_new_tokens: 150 }),
      });

      const text = await res.text();
      let json = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch (e) {
        // not JSON, return raw text
        return text.trim();
      }

      if (!json) return null;
      if (typeof json === 'string') return json.trim();
      if (json.text) return json.text.toString().trim();
      if (json.generated_text) return json.generated_text.toString().trim();
      if (json.result) return json.result.toString().trim();
      if (Array.isArray(json.results) && json.results[0]) {
        const r = json.results[0];
        if (r.text) return r.text.toString().trim();
        if (r.generated_text) return r.generated_text.toString().trim();
        if (r.output_text) return r.output_text.toString().trim();
      }
      if (Array.isArray(json) && json[0] && json[0].generated_text) return json[0].generated_text.toString().trim();

      return JSON.stringify(json).trim();
    } catch (err) {
      console.error('Local LLM call failed:', err);
      return null;
    }
  }

export async function POST(request) {
  let requestBody = null;
  try {
    requestBody = await request.json();
  } catch (error) {
    console.error('AI route: failed to parse request body as JSON:', error);
  }

  const prompt = requestBody?.prompt;
  console.log('AI route prompt:', prompt ? prompt.toString().slice(0,200) : '<missing>');

  try {
    // If a Supabase function URL is provided, prefer it (easy serverless route)
    if (process.env.SUPABASE_FUNCTION_URL) {
      try {
        const supHeaders = { 'Content-Type': 'application/json' };
        if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          supHeaders.apikey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
          supHeaders.Authorization = `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`;
        }

        console.log('Calling Supabase function with prompt length', prompt ? prompt.toString().length : 0);
        const supRes = await fetch(process.env.SUPABASE_FUNCTION_URL, {
          method: 'POST',
          headers: supHeaders,
          body: JSON.stringify({ prompt }),
        });

        const supText = await supRes.text();
        console.log('Supabase function status:', supRes.status);
        console.log('Supabase response preview:', supText ? supText.slice(0,500) : '<empty>');

        let supJson = null;
        try { supJson = supText ? JSON.parse(supText) : null; } catch (e) {
          console.warn('Supabase function response is not valid JSON:', e.message);
        }

        const out = (supJson && (supJson.text || supJson.output_text)) || (supJson ? JSON.stringify(supJson) : supText);
        if (supRes.ok && out) {
          return NextResponse.json({ text: out.toString().trim(), source: 'supabase' });
        }

        console.warn('Supabase function did not return OK or contained no output.', {
          ok: supRes.ok,
          status: supRes.status,
          out,
          raw: supText?.slice(0,1000),
        });
      } catch (err) {
        console.error('Supabase function call failed:', err);
      }
    }

    // If there's no OpenAI key, prefer a local LLM endpoint if configured
    if (!process.env.OPENAI_API_KEY) {
      if (process.env.LOCAL_LLM_URL) {
        const localText = await callLocalLLM(prompt);
        if (localText) {
          return NextResponse.json({ text: localText, source: 'local_llm' });
        }
        console.warn('LOCAL_LLM_URL configured but returned no usable text');
      }

      const fallback = generateFallback(prompt);
      return NextResponse.json({ text: fallback, fallback: true });
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `
Je bent een professionele factuurassistent.

Maak alleen een zakelijke factuuromschrijving.
Geen begroeting.
Geen uitleg.
Geen extra tekst.

Maak een duidelijke omschrijving van 2 tot 3 zinnen.

Dienst:
${prompt}


Geef een korte zakelijke omschrijving die direct op een factuur geplaatst kan worden.
`,
    });

    // Robustly extract text from the Responses API result
    let aiText = '';
    if (response.output_text) aiText = response.output_text;
    else if (Array.isArray(response.output) && response.output.length) {
      const first = response.output[0];
      // Older/newer SDK shapes may nest content differently
      if (first.text) aiText = first.text;
      else if (Array.isArray(first.content) && first.content.length) {
        const c = first.content[0];
        aiText = c?.text || c?.content?.[0]?.text || '';
      }
    }

    aiText = (aiText || '').toString().trim();

    if (!aiText) {
      console.error('AI route: geen tekst in AI response', response);
      const fallback = generateFallback(prompt);
      return NextResponse.json({ text: fallback, fallback: true, warning: 'no_ai_text' });
    }

    return NextResponse.json({ text: aiText });
  } catch (error) {
    console.error('AI route error:', error);

    // Attempt to extract prompt from the request for a better fallback
    let reqPrompt = '';
    try {
      const body = await request.json();
      reqPrompt = body?.prompt || '';
    } catch (e) {
      // ignore
    }

    // If the error is quota-related, return a local fallback instead of failing
    const isQuota = error?.code === 'insufficient_quota' || error?.type === 'insufficient_quota';
    const fallback = generateFallback(reqPrompt);
    const warning = isQuota ? 'insufficient_quota' : (error?.message || 'unknown_error');
    return NextResponse.json({ text: fallback, fallback: true, warning });
  }
}
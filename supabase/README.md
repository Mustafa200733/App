# Supabase Edge Function (AI)

This folder contains an example Supabase Edge Function that forwards a `prompt` to the Hugging Face Inference API and returns a `text` field.

Steps to deploy

1. Install and login to the Supabase CLI: https://supabase.com/docs/guides/cli
2. Create a new function project or place this folder under `supabase/functions/ai`.
3. Set secrets in Supabase (project level):

```bash
supabase secrets set HF_API_KEY="hf_..."
supabase secrets set HF_MODEL="gpt2"   # or another supported model
```

4. Deploy the function:

```bash
supabase functions deploy ai --project-ref <your-project-ref>
```

5. Use the function URL in your app as `SUPABASE_FUNCTION_URL` (in `.env` or docker env). Example POST body:

```json
{ "prompt": "Website maken voor restaurant" }
```

The function returns JSON: `{ "text": "..." }`.

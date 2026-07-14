# text-generation-webui — snelle setup (Windows/macOS/Linux)

Deze instructie laat zien hoe je snel een lokale text-generation-webui (oobabooga) opzet en koppelt aan `invoice-ai` via `LOCAL_LLM_URL`.

Opmerking: modellen kunnen veel CPU/RAM/VRAM gebruiken. Kies een klein model (CPU-compatibel GGML/GGUF) als je geen GPU hebt.

1. Clone en installeer (Windows voorbeeld)

```powershell
git clone https://github.com/oobabooga/text-generation-webui.git
cd text-generation-webui
python -m venv venv
venv\Scripts\Activate.ps1   # PowerShell
pip install -r requirements.txt
```

macOS / Linux (bash)

```bash
git clone https://github.com/oobabooga/text-generation-webui.git
cd text-generation-webui
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

2. Download een model

- Voor snelle tests: gebruik een klein GGML/GGUF model van GPT4All of een kleine LLaMA-variant (zoeken op Hugging Face of GPT4All releases). Plaats het model in de `models/` map van de webui.
- Voor GPU: gebruik een HF checkpoint (bijv. mistral-small) en volg webui instructies.

3. Start de webui server

```bash
# voorbeeld: vervang {model-folder-or-name} door het pad/naam van je model
python server.py --model {model-folder-or-name}
```

Standaard draait de server op `http://localhost:7860` en biedt een HTTP API endpoint op `/api/v1/generate`.

4. Stel `LOCAL_LLM_URL` in je app in

Voeg toe aan `invoice-ai/.env.local`:

```
LOCAL_LLM_URL=http://localhost:7860/api/v1/generate
```

Herstart de Next.js dev-server:

```bash
cd invoice-ai
npm run dev
```

5. Test de webui API direct (curl)

```bash
curl -s -X POST http://localhost:7860/api/v1/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Website maken voor restaurant","max_new_tokens":150}'
```

Veel webui endpoints geven JSON terug met één van de vormen:

- `{ "results": [{ "text": "..." }] }`
- `{ "generated_text": "..." }`
- of raw tekst

Onze `app/api/ai/route.js` ondersteunt veel van deze vormen en zal het resultaat gebruiken.

6. Test via je app (frontend)

Open `http://localhost:3000`, vul de dienst in en klik op `Genereer met AI` — de server probeert eerst `LOCAL_LLM_URL` te gebruiken en toont het resultaat als `source: local_llm`.

Problemen / resources

- Model downloaden: kijk naar GPT4All releases (ggml) of Hugging Face model pages.
- webui README: https://github.com/oobabooga/text-generation-webui
- Als je wilt, kan ik een concrete model-aanbeveling en exact download-commando geven voor jouw systeem (CPU of GPU). Geef aan welke OS en of je GPU hebt.

# Python Service — Pajajaran Digital

Layanan pendukung berbasis FastAPI. **Opsional** — website dapat berjalan tanpa layanan ini.

## Menjalankan

```bash
cd apps/python-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Endpoint

- `GET /health` — health check
- `GET /search/suggest?q=...` — placeholder untuk saran pencarian

## Catatan

Layanan ini tidak memiliki tanggung jawab tumpang tindih dengan backend utama (Express). Backend utama tetap menjadi sumber kebenaran untuk data.

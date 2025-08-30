import { NextResponse } from 'next/server';

// Proxy to external ML tunnel to avoid CORS / network issues client-side
const ML_ENDPOINT = 'https://ggw0nrs8-5000.inc1.devtunnels.ms/submit';

export async function POST(request) {
  try {
    const body = await request.json();
    const prompt = body.prompt || '';
    if (!prompt.trim()) {
      return NextResponse.json({ success: false, error: 'Prompt required' }, { status: 400 });
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(ML_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) {
      return NextResponse.json({ success: false, error: 'Upstream ML error' }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch (e) {
    const aborted = e.name === 'AbortError';
    return NextResponse.json({ success: false, error: aborted ? 'ML request timed out' : e.message }, { status: 500 });
  }
}

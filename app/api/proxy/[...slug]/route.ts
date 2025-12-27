import { NextRequest, NextResponse } from 'next/server';

const TARGET_API_URL = process.env.PYTHON_API_BASE_URL || "http://localhost:8000/api/v1";

async function proxyRequest(req: NextRequest) {
  try {
    let path = req.nextUrl.pathname.replace('/api/proxy/', '');
    
    if (!/\.[^/]+$/.test(path) && !path.endsWith('/')) {
        path += '/';
    }

    const targetUrl = `${TARGET_API_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}${req.nextUrl.search}`;
    
    console.log(`[Proxy] Forwarding to: ${targetUrl}`);

    const headers = new Headers(req.headers);
    headers.delete('host');
    headers.delete('connection');
    
    let body = null;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        const textBody = await req.text();
        body = textBody || null;
    }

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: body,
      // @ts-expect-error - La propriété 'duplex' est nécessaire pour le streaming.
      duplex: 'half', 
    });

    // --- CORRECTION MAJEURE ET FINALE ---
    // Si le backend répond "204 No Content", on doit construire une réponse
    // sans corps (`null`) pour éviter l'erreur TypeError.
    if (response.status === 204) {
      console.log("[Proxy] Received 204 No Content from backend, returning empty response.");
      return new NextResponse(null, {
          status: 204,
          statusText: response.statusText,
      });
    }
    // --- FIN DE LA CORRECTION ---

    const data = await response.text();

    return new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
      },
    });

  } catch (error) {
    console.error(`[API Proxy Error]:`, error);
    return new NextResponse(JSON.stringify({ error: "Proxy request failed", details: String(error) }), { status: 502 });
  }
}

export async function GET(req: NextRequest) { return proxyRequest(req); }
export async function POST(req: NextRequest) { return proxyRequest(req); }
export async function PUT(req: NextRequest) { return proxyRequest(req); }
export async function PATCH(req: NextRequest) { return proxyRequest(req); }
export async function DELETE(req: NextRequest) { return proxyRequest(req); }
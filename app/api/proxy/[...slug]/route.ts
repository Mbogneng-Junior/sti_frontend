import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

// On récupère l'URL du backend depuis le .env (défini à l'étape 1)
const TARGET_API_URL = process.env.PYTHON_API_BASE_URL || "http://localhost:8000/api/v1";

async function proxyRequest(req: NextRequest) {
  try {
    const { getToken } = await auth(); // await est important dans les versions récentes de Clerk
    let token: string | null = null;

    if (getToken) {
      token = await getToken();
    }

    // 1. Extraire le chemin après /api/proxy/
    // Ex: si l'URL est /api/proxy/expert/cas-cliniques/, slug sera "expert/cas-cliniques/"
    const path = req.nextUrl.pathname.replace('/api/proxy/', '');
    
    // 2. Construire l'URL cible
    // Ex: http://104.236.244.230/api/v1/expert/cas-cliniques/?param=1
    const targetUrl = `${TARGET_API_URL}/${path}${req.nextUrl.search}`;
    
    console.log(`[Proxy] Forwarding to: ${targetUrl}`);

    const headers = new Headers(req.headers);
    // On nettoie les headers qui pourraient causer des soucis
    headers.delete('host');
    headers.delete('connection');
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    // Si on a un body (POST/PUT), on doit le lire
    let body = null;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        const textBody = await req.text();
        body = textBody || null;
    }

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: body,
      // @ts-ignore - Nécessaire pour certains environnements Node
      duplex: 'half', 
    });

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
export async function PATCH(req: NextRequest) { return proxyRequest(req); } // Ajouté PATCH au cas où
export async function DELETE(req: NextRequest) { return proxyRequest(req); }
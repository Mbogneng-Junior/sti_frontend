import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.PYTHON_API_BASE_URL || "http://localhost:8000";

async function proxyRequest(req: NextRequest) {
  const { getToken } = auth();
  let token: string | null = null;

  if (getToken) {
    token = await getToken();
  }

  const slug = (req.nextUrl.pathname.match(/api\/proxy\/(.*)/) || [])[1];
  const targetUrl = `${API_BASE_URL}/api/${slug}${req.nextUrl.search}`;
  
  const headers = new Headers(req.headers);
  headers.set('Host', new URL(targetUrl).host);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: req.body,
      // @ts-ignore
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
    console.error(`[API Proxy Error] for ${targetUrl}:`, error);
    return new NextResponse(JSON.stringify({ error: "Proxy request failed" }), { status: 502 });
  }
}

export async function GET(req: NextRequest) {
  return proxyRequest(req);
}
export async function POST(req: NextRequest) {
  return proxyRequest(req);
}
export async function PUT(req: NextRequest) {
  return proxyRequest(req);
}
export async function DELETE(req: NextRequest) {
  return proxyRequest(req);
}

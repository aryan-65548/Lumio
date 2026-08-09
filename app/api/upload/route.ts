import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';

    const res = await fetch(`${backendUrl}/api/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error('Backend upload connection error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to connect to backend upload API' },
      { status: 500 }
    );
  }
}


import { NextResponse } from 'next/server';

const BLOB_KEY = 'planetfashion-store-v3.json';

// In-memory fallback (per-function, but works for demo sync)
let memoryStore: any = null;
let useBlob = false;

async function loadStore(): Promise<any> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { list } = await import('@vercel/blob');
      const { blobs } = await list({ prefix: BLOB_KEY });
      if (blobs.length > 0) {
        const res = await fetch(blobs[0].url);
        const data = await res.json();
        if (data) {
          useBlob = true;
          return data;
        }
      }
      useBlob = true;
      return null;
    } catch {
      // fallback to memory
    }
  }
  return memoryStore;
}

async function saveStore(data: any): Promise<void> {
  if (useBlob && process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { put } = await import('@vercel/blob');
      await put(BLOB_KEY, JSON.stringify(data), {
        contentType: 'application/json',
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
      } as any);
      return;
    } catch {}
  }
  memoryStore = data;
}

export async function GET() {
  const data = await loadStore();
  // Return empty object if no store yet, client will use defaults
  return NextResponse.json(data || {}, {
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Body should contain partial or full store state
    // Merge with existing
    const existing = (await loadStore()) || {};
    const merged = { ...existing, ...body, updatedAt: Date.now() };
    await saveStore(merged);
    return NextResponse.json({ success: true, data: merged });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 400 });
  }
}

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { image, name } = await req.json();
    if (!image) {
      return NextResponse.json({ error: 'Missing image content' }, { status: 400 });
    }

    // Convert base64 data URL to a binary Blob
    const base64Data = image.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Create Form-data for tmpfiles.org upload
    const formData = new FormData();
    const cleanName = (name || 'builder').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const filename = `hackerhouse-goa-2026-${cleanName}-${Date.now()}.png`;
    
    const blob = new Blob([buffer], { type: 'image/png' });
    formData.append('file', blob, filename);

    // Upload to tmpfiles.org
    const uploadRes = await fetch('https://tmpfiles.org/api/v1/upload', {
      method: 'POST',
      body: formData,
    });

    if (!uploadRes.ok) {
      throw new Error(`Failed to upload to ephemeral storage: ${uploadRes.statusText}`);
    }

    const result = await uploadRes.json();
    
    if (result.status === 'success' && result.data?.url) {
      // Modify URL to download URL (insert /dl/ between tmpfiles.org and the ID)
      const downloadUrl = result.data.url.replace('https://tmpfiles.org/', 'https://tmpfiles.org/dl/');
      return NextResponse.json({ success: true, url: downloadUrl });
    } else {
      throw new Error(result.message || 'Upload failed');
    }
  } catch (error: any) {
    console.error('Upload route error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}

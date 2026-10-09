import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'guides', 'Danethicals-Rabbit-Farming-Guide-Nigeria.pdf');
    
    if (!fs.existsSync(filePath)) {
      return new NextResponse('Guide file not found', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Danethicals-Rabbit-Farming-Guide-Nigeria.pdf"',
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
      },
    });
  } catch (err) {
    console.error('Error serving guide download:', err);
    return new NextResponse('Error downloading file', { status: 500 });
  }
}

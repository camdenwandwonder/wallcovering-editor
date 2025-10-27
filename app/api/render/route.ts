import { NextRequest, NextResponse } from 'next/server';
import { renderCrop } from '@/lib/render';
import { uploadBuffer } from '@/lib/s3';


export const maxDuration = 60; // Vercel limit safeguard


export async function POST(req: NextRequest) {
try {
const body = await req.json();
const { source_image_url, width_cm, height_cm, ppi, bleed_mm, transform } = body ?? {};
const PPI = Number(ppi ?? process.env.DEFAULT_PPI ?? 150);
const BLEED = Number(bleed_mm ?? process.env.DEFAULT_BLEED_MM ?? 10);


if (!source_image_url || !width_cm || !height_cm || !transform) {
return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
}


const { preview, production, meta } = await renderCrop({
srcUrl: source_image_url,
width_cm, height_cm,
ppi: PPI,
bleed_mm: BLEED,
transform
});


const Bucket = process.env.S3_BUCKET!;
const orderKey = `orders/tmp/${Date.now()}_${Math.random().toString(36).slice(2)}`;
const previewKey = `${orderKey}_preview.webp`;
const prodKey = `${orderKey}_print.tiff`;


const preview_url = await uploadBuffer({ Bucket, Key: previewKey, Body: preview, ContentType: 'image/webp' });
const production_file_url = await uploadBuffer({ Bucket, Key: prodKey, Body: production, ContentType: 'image/tiff' });


return NextResponse.json({ preview_url, production_file_url, ...meta });
} catch (e: any) {
return NextResponse.json({ error: e.message ?? 'Render error' }, { status: 500 });
}
}

import sharp from 'sharp';


export async function renderCrop({
srcUrl,
width_cm,
height_cm,
ppi,
bleed_mm,
transform
}: {
srcUrl: string;
width_cm: number;
height_cm: number;
ppi: number;
bleed_mm: number;
transform: { scale: number; offset_x_px: number; offset_y_px: number; mirror_horizontal?: boolean };
}) {
const pxPerCm = ppi / 2.54;
const target_w_px = Math.round(width_cm * pxPerCm);
const target_h_px = Math.round(height_cm * pxPerCm);
const bleed_px = Math.round((bleed_mm / 10) * pxPerCm);


// Fetch bronbestand
const res = await fetch(srcUrl);
if (!res.ok) throw new Error('Kan bronafbeelding niet laden');
const buf = Buffer.from(await res.arrayBuffer());


let img = sharp(buf, { unlimited: true }).withMetadata();
const meta = await img.metadata();
const srcW = meta.width ?? 0;
const srcH = meta.height ?? 0;
if (!srcW || !srcH) throw new Error('Bronafbeelding heeft onbekende afmetingen');


if (transform.mirror_horizontal) img = img.flop();


// Bepaal crop in bron‑px (incl. bleed)
const cropX = Math.max(0, Math.round(transform.offset_x_px - bleed_px));
const cropY = Math.max(0, Math.round(transform.offset_y_px - bleed_px));
const cropW = Math.min(srcW - cropX, target_w_px + 2 * bleed_px);
const cropH = Math.min(srcH - cropY, target_h_px + 2 * bleed_px);


const extracted = img.extract({ left: cropX, top: cropY, width: cropW, height: cropH });


const preview = await extracted.resize({ width: Math.min(2048, cropW) }).webp({ quality: 85 }).toBuffer();
const production = await extracted.tiff({ compression: 'zip' }).toBuffer();


return {
preview,
production,
meta: { srcW, srcH, target_px: { w: target_w_px, h: target_h_px }, bleed_px }
};
}

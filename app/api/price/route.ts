import { NextRequest, NextResponse } from 'next/server';
import { calcPrice } from '@/lib/pricing';


export async function POST(req: NextRequest) {
const body = await req.json();
const { width_cm, height_cm, base_price_per_m2, round_step, min_m2 } = body ?? {};
if (!width_cm || !height_cm) return NextResponse.json({ error: 'Missing dimensions' }, { status: 400 });
const res = calcPrice({ width_cm, height_cm, base_price_per_m2, round_step, min_m2 });
return NextResponse.json(res);
}

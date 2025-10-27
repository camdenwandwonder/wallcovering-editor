import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
const body = await req.json();
const { query, variables } = body ?? {};


const res = await fetch(process.env.SHOPIFY_STOREFRONT_API_URL!, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_API_TOKEN!
},
body: JSON.stringify({ query, variables })
});
const json = await res.json();
return NextResponse.json(json);
}

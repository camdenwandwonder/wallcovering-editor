export function calcPrice({ width_cm, height_cm, base_price_per_m2, round_step = 10, min_m2 = 1 }: {
width_cm: number;
height_cm: number;
base_price_per_m2?: number;
round_step?: number;
min_m2?: number;
}) {
const pricePerM2 = base_price_per_m2 ?? Number(process.env.PRICE_PER_M2 ?? 99);
const areaM2 = (width_cm / 100) * (height_cm / 100);
const minArea = Math.max(areaM2, min_m2);
const eff = Math.ceil(minArea * round_step) / round_step; // afronden op 0.1 m2
const unitSize = 0.1;
const qtyUnits = Math.round(eff / unitSize);
const unitPrice = pricePerM2 * unitSize; // 9.90 bij 99/m2
const total = unitPrice * qtyUnits;
return {
area_m2: Number(areaM2.toFixed(4)),
effective_m2: Number(eff.toFixed(2)),
unit: "0.1m2",
qty_units: qtyUnits,
unit_price: Number(unitPrice.toFixed(2)),
total_price: Number(total.toFixed(2))
};
}

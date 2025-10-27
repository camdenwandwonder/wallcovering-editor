export type PriceInput = {
width_cm: number;
height_cm: number;
base_price_per_m2?: number;
round_step?: number;
min_m2?: number;
};


export type RenderInput = {
source_image_url: string;
width_cm: number;
height_cm: number;
ppi?: number;
bleed_mm?: number;
transform: {
scale: number;
offset_x_px: number;
offset_y_px: number;
mirror_horizontal?: boolean;
};
};

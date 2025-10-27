'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Stage, Layer, Image as KImage, Line, Rect } from 'react-konva';


const DEFAULT_PPI = 150; // UI‑ppi, productie‑ppi kan via ENV/POST bepaald worden
const PANEL_WIDTH_CM = 50;


function useImage(url?: string) {
const [img, setImg] = useState<HTMLImageElement | null>(null);
useEffect(() => {
if (!url) return;
const i = new window.Image();
i.crossOrigin = 'anonymous';
i.onload = () => setImg(i);
i.src = url;
}, [url]);
return img;
}


export default function EditorClient() {
const qs = new URLSearchParams(window.location.search);
const imageSrc = qs.get('imageSrc') || '';
const variantId = qs.get('variantId') || '';
const cartId = qs.get('cartId') || '';
const basePrice = Number(qs.get('pricePerM2') || 99);


const [widthCm, setWidthCm] = useState(Number(qs.get('w') || 300));
const [heightCm, setHeightCm] = useState(Number(qs.get('h') || 250));
const [mirror, setMirror] = useState(false);
const [showPanels, setShowPanels] = useState(true);


const img = useImage(imageSrc);
const stageRef = useRef<any>(null);
const kimgRef = useRef<any>(null);


const aspect = widthCm / heightCm;
const [viewportW, setViewportW] = useState(() => Math.min(960, window.innerWidth - 32));
const viewportH = viewportW / aspect;


useEffect(() => {
const onResize = () => setViewportW(Math.min(960, window.innerWidth - 32));
window.addEventListener('resize', onResize);
return () => window.removeEventListener('resize', onResize);
}, []);


useEffect(() => {
const stage = stageRef.current?.getStage();
if (!stage) return;
stage.on('wheel', (e: any) => {
e.evt.preventDefault();
const scaleBy = 1.05;
const konvaImg = kimgRef.current;
if (!konvaImg) return;
const oldScale = konvaImg.scaleX();
const pointer = stage.getPointerPosition();
const mousePointTo = { x: (pointer.x - konvaImg.x()) / oldScale, y: (pointer.y - konvaImg.y()) / oldScale };
const direction = e.evt.deltaY > 0 ? 1 : -1;
const newScale = direction > 0 ? oldScale / scaleBy : oldScale * scaleBy;
konvaImg.scale({ x: newScale, y: newScale });
const newPos = { x: pointer.x - mousePointTo.x * newScale, y: pointer.y - mousePointTo.y * newScale };
konvaImg.position(newPos);
});
}, []);


const pxPerCm = DEFAULT_PPI / 2.54;
const targetPxW = Math.round(widthCm * pxPerCm);
const targetPxH = Math.round(heightCm * pxPerCm);


const priceClient = useMemo(() => {
}

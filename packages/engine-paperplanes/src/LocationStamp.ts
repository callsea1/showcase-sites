export function createLocationStampTexture(city: string, label: string): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#ff9398';
  ctx.lineWidth = 6;
  ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);

  ctx.fillStyle = '#2a2a2a';
  ctx.font = 'bold 28px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(city.toUpperCase(), canvas.width / 2, 52);

  ctx.fillStyle = '#5ecfcf';
  ctx.font = '18px monospace';
  ctx.fillText(label, canvas.width / 2, 88);

  return canvas;
}

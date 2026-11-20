// Groups gallery images into rows: two consecutive portraits share a row, everything else stands alone.
// Images are never cropped; paired portraits get column widths proportional to their aspect ratio.
export function toRows<T extends { src: { width: number; height: number } }>(images: T[]): T[][] {
  const rows: T[][] = [];
  const portrait = (i?: T) => !!i && i.src.height > i.src.width;
  for (let i = 0; i < images.length; i++) {
    if (portrait(images[i]) && portrait(images[i + 1])) {
      rows.push([images[i], images[i + 1]]);
      i++;
    } else {
      rows.push([images[i]]);
    }
  }
  return rows;
}

export function mergeAndShift(cells, reverse = false) {
  if (reverse) {
    cells.reverse();
  }

  const filtered = cells.filter((cell) => cell !== 0);
  const merged = [];

  for (let i = 0; i < filtered.length; i++) {
    if (filtered[i] === filtered[i + 1]) {
      merged.push(filtered[i] * 2);
      i++;
    } else {
      merged.push(filtered[i]);
    }
  }

  while (merged.length < cells.length) {
    merged.push(0);
  }

  if (reverse) {
    merged.reverse();
  }

  return merged;
}

export function mergeAndShift(cells, reverse = false) {
  if (reverse) {
    cells.reverse();
  }

  const filtered = cells.filter((cell) => cell !== 0);
  const merged = [];
  let mergeSum = 0;

  for (let i = 0; i < filtered.length; i++) {
    if (filtered[i] === filtered[i + 1]) {
      const newValue = filtered[i] * 2;

      merged.push(newValue);
      mergeSum += newValue;
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

  return { merged, mergeSum };
}

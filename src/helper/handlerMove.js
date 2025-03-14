export default function moveTiles(line, reversed = false) {
  let newRow = line.filter((val) => val !== 0);
  if (reversed) newRow.reverse();

  const mergedRow = [];
  let score = 0;

  for (let i = 0; i < newRow.length; i++) {
    if (newRow[i] === newRow[i + 1]) {
      mergedRow.push(newRow[i] * 2);
      score += newRow[i] * 2;
      i++;
    } else {
      mergedRow.push(newRow[i]);
    }
  }

  while (mergedRow.length < 4) {
    mergedRow.push(0);
  }

  return { newRow: reversed ? mergedRow.reverse() : mergedRow, score };
}

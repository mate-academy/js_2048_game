function moveRowLeft(row) {
  const filteredRow = row.filter((cell) => cell !== 0);

  for (let i = 0; i < filteredRow.length - 1; i++) {
    if (filteredRow[i] === filteredRow[i + 1]) {
      filteredRow[i] *= 2;
      this.score += filteredRow[i];
      filteredRow[i + 1] = 0;
    }
  }

  const mergedRow = filteredRow.filter((cell) => cell !== 0);

  while (mergedRow.length < 4) {
    mergedRow.push(0);
  }

  return mergedRow;
}

export function moveRowRight(row) {
  const filteredRow = row.filter((cell) => cell !== 0);

  for (let i = filteredRow.length - 1; i > 0; i--) {
    if (filteredRow[i] === filteredRow[i - 1]) {
      filteredRow[i] *= 2;
      this.score += filteredRow[i];
      filteredRow[i - 1] = 0;
    }
  }

  const mergedRow = filteredRow.filter((cell) => cell !== 0);

  while (mergedRow.length < 4) {
    mergedRow.unshift(0);
  }

  return mergedRow;
}

export function transpose(matrix) {
  return matrix[0].map((value, colIndex) => matrix.map((row) => row[colIndex]));
}

export function areBoardsEqual(board1, board2) {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (board1[row][col] !== board2[row][col]) {
        return false;
      }
    }
  }

  return true;
}

module.exports = moveRowLeft;

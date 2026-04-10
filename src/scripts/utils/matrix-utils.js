export const createEmptyMatrix = (size = 4) => {
  return Array.from({ length: size }, () => Array(size).fill(0));
};

export const cloneMatrix = (matrix) => {
  return matrix.map((row) => row.slice());
};

export const transpose = (matrix) => {
  if (!matrix.length) {
    return [];
  }

  const cols = Math.max(...matrix.map((row) => (row ? row.length : 0)));

  return Array.from({ length: cols }, (_, c) => {
    return matrix.map((row) => {
      return row && row[c] != null ? row[c] : 0;
    });
  });
};

export const isMatrixEqual = (a, b) => {
  if (!Array.isArray(a) || !Array.isArray(b)) {
    return false;
  }

  if (a.length !== b.length) {
    return false;
  }

  return a.every(
    (rowA, r) =>
      Array.isArray(rowA) &&
      Array.isArray(b[r]) &&
      rowA.length === b[r].length &&
      rowA.every((cellA, c) => cellA === b[r][c]),
  );
};

export const forEachCell = (matrix, cb) => {
  matrix.forEach((row, idxRow) => {
    if (!Array.isArray(row)) {
      return;
    }

    row.forEach((value, idxCell) => cb(value, idxRow, idxCell));
  });
};

export const flatten = (matrix) => [].concat(...matrix.filter(Array.isArray));

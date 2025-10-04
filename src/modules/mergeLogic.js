function shiftAndMerge(board, direction) {
  const transpose = (matrix) =>
    matrix[0].map((_, i) => matrix.map((row) => row[i]));
  const reverse = (matrix) => matrix.map((row) => [...row].reverse());

  const rotate = {
    up: transpose,
    down: (b) => reverse(transpose(b)),
    left: (b) => b,
    right: reverse,
  };

  const unrotate = {
    up: transpose,
    down: (b) => transpose(reverse(b)),
    left: (b) => b,
    right: reverse,
  };

  const rotated = rotate[direction](board);
  let score = 0;

  const mergedBoard = rotated.map((row) => {
    const { merged, mergeScore } = mergeRow(row);

    score += mergeScore;

    return merged;
  });

  return { board: unrotate[direction](mergedBoard), totalScore: score };
}

function mergeRow(row) {
  const filtered = row.filter((num) => num !== 0);
  const result = [];
  let score = 0;

  for (let i = 0; i < filtered.length; i++) {
    if (filtered[i] === filtered[i + 1]) {
      const merged = filtered[i] * 2;

      result.push(merged);
      score += merged;
      i++;
    } else {
      result.push(filtered[i]);
    }
  }

  while (result.length < 4) {
    result.push(0);
  }

  return { merged: result, mergeScore: score };
}

module.exports = { shiftAndMerge };

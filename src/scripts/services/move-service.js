import * as matrix from '../utils/matrix-utils';

const compressRowLeft = (row) => {
  const nums = row.filter((v) => v !== 0);

  const res = [];
  let gained = 0;

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === nums[i + 1]) {
      const merged = nums[i] * 2;

      res.push(merged);
      gained += merged;
      i++;
    } else {
      res.push(nums[i]);
    }
  }

  while (res.length < row.length) {
    res.push(0);
  }

  return { row: res, gained };
};

export const moveLeft = (gameState) => {
  let totalGained = 0;

  const newState = gameState.map((row) => {
    const { row: newRow, gained } = compressRowLeft(row);

    totalGained += gained;

    return newRow;
  });

  return { newState, totalGained };
};

export const moveRight = (gameState) => {
  let totalGained = 0;
  const newState = gameState.map((row) => {
    const reversed = [...row].reverse();
    const { row: movedReversed, gained } = compressRowLeft(reversed);

    totalGained += gained;

    return movedReversed.reverse();
  });

  return { newState, totalGained };
};

export const moveUp = (gameState) => {
  const transposed = matrix.transpose(gameState);
  const { newState, totalGained } = moveLeft(transposed);

  return {
    newState: matrix.transpose(newState),
    totalGained,
  };
};

export const moveDown = (gameState) => {
  const transposed = matrix.transpose(gameState);
  const { newState, totalGained } = moveRight(transposed);

  return {
    newState: matrix.transpose(newState),
    totalGained,
  };
};

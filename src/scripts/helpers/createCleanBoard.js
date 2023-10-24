
import { cols, rows } from '../main';

export const createCleanBoard = () => {
  const matrix = [];

  for (let r = 0; r < rows; r++) {
    matrix.push([]);

    for (let c = 0; c < cols; c++) {
      matrix[r].push(0);
    }
  }

  return matrix;
};

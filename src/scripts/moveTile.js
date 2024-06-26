export function moveTiles(tileField, size, direction) {
  let mergeOccurred = false;
  // eslint-disable-next-line max-len
  const mergedTiles = new Array(size).fill(false); // Array to track merged tiles

  switch (direction) {
    case 'left':
      // Compact tiles (move all tiles to the left)
      for (let row = 0; row < size; row++) {
        for (let col = 1; col < size; col++) {
          if (tileField[row][col] !== 0) {
            let currentCol = col;

            while (currentCol > 0 && tileField[row][currentCol - 1] === 0) {
              // Move tile to the left
              tileField[row][currentCol - 1] = tileField[row][currentCol];
              tileField[row][currentCol] = 0;
              currentCol--;
            }
          }
        }
      }
      break;

    case 'right':
      // Compact tiles (move all tiles to the right)
      for (let row = 0; row < size; row++) {
        for (let col = size - 2; col >= 0; col--) {
          if (tileField[row][col] !== 0) {
            let currentCol = col;

            while (
              currentCol < size - 1 &&
              tileField[row][currentCol + 1] === 0
            ) {
              // Move tile to the right
              tileField[row][currentCol + 1] = tileField[row][currentCol];
              tileField[row][currentCol] = 0;
              currentCol++;
            }
          }
        }
      }
      break;

    case 'up':
      // Compact tiles (move all tiles upwards)
      for (let col = 0; col < size; col++) {
        for (let row = 1; row < size; row++) {
          if (tileField[row][col] !== 0) {
            let currentRow = row;

            while (currentRow > 0 && tileField[currentRow - 1][col] === 0) {
              // Move tile upwards
              tileField[currentRow - 1][col] = tileField[currentRow][col];
              tileField[currentRow][col] = 0;
              currentRow--;
            }
          }
        }
      }
      break;

    case 'down':
      // Compact tiles (move all tiles downwards)
      for (let col = 0; col < size; col++) {
        for (let row = size - 2; row >= 0; row--) {
          if (tileField[row][col] !== 0) {
            let currentRow = row;

            while (
              currentRow < size - 1 &&
              tileField[currentRow + 1][col] === 0
            ) {
              // Move tile downwards
              tileField[currentRow + 1][col] = tileField[currentRow][col];
              tileField[currentRow][col] = 0;
              currentRow++;
            }
          }
        }
      }
      break;

    default:
      throw new Error(`Invalid direction: ${direction}`);
  }

  // Merge tiles (combine adjacent identical tiles)
  switch (direction) {
    case 'left':
      for (let row = 0; row < size; row++) {
        for (let col = 1; col < size; col++) {
          if (
            tileField[row][col] !== 0 &&
            tileField[row][col] === tileField[row][col - 1] &&
            !mergedTiles[col - 1]
          ) {
            // Merge tiles
            tileField[row][col - 1] *= 2;
            tileField[row][col] = 0;
            mergedTiles[col - 1] = true;
            mergeOccurred = true;
          }
        }
      }
      break;

    case 'right':
      for (let row = 0; row < size; row++) {
        for (let col = size - 2; col >= 0; col--) {
          if (
            tileField[row][col] !== 0 &&
            tileField[row][col] === tileField[row][col + 1] &&
            !mergedTiles[col + 1]
          ) {
            // Merge tiles
            tileField[row][col + 1] *= 2;
            tileField[row][col] = 0;
            mergedTiles[col + 1] = true;
            mergeOccurred = true;
          }
        }
      }
      break;

    case 'up':
      for (let col = 0; col < size; col++) {
        for (let row = 1; row < size; row++) {
          if (
            tileField[row][col] !== 0 &&
            tileField[row][col] === tileField[row - 1][col] &&
            !mergedTiles[row - 1]
          ) {
            // Merge tiles
            tileField[row - 1][col] *= 2;
            tileField[row][col] = 0;
            mergedTiles[row - 1] = true;
            mergeOccurred = true;
          }
        }
      }
      break;

    case 'down':
      for (let col = 0; col < size; col++) {
        for (let row = size - 2; row >= 0; row--) {
          if (
            tileField[row][col] !== 0 &&
            tileField[row][col] === tileField[row + 1][col] &&
            !mergedTiles[row + 1]
          ) {
            // Merge tiles
            tileField[row + 1][col] *= 2;
            tileField[row][col] = 0;
            mergedTiles[row + 1] = true;
            mergeOccurred = true;
          }
        }
      }
      break;

    default:
      throw new Error(`Invalid direction: ${direction}`);
  }

  return { mergeOccurred, tileField };
}

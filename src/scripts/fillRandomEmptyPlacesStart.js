import { getRandomIndexes } from './randomAddCellToEmpty';

export function fillRandomEmptyPlacesStart(field) {
  if (!Array.isArray(field)) {
    // eslint-disable-next-line no-console
    console.error('Expected field to be an array.');

    return field;
  }

  const emptyPositions = [];

  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[i].length; j++) {
      if (field[i][j] === 0) {
        emptyPositions.push({ x: i, y: j });
      }
    }
  }

  if (emptyPositions.length >= 2) {
    const randomIndexes = getRandomIndexes(emptyPositions.length);

    for (let i = 0; i < 2; i++) {
      const { x, y } = emptyPositions[randomIndexes[i]];

      field[x][y] = 2;
    }
  } else {
    // eslint-disable-next-line no-console
    console.log('Not enough empty positions to fill.');
  }

  return field;
}

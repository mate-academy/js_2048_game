import { messageStartLose } from './main';

export function getRandomIndexes(max) {
  const indexes = [];
  let count = 0;

  while (count < 4) {
    const randomIndex = Math.floor(Math.random() * max);

    if (!indexes.includes(randomIndex)) {
      if (Math.random() < 0.1) {
        indexes.push(randomIndex);
        count++;
      } else if (count < 2) {
        indexes.push(randomIndex);
        count++;
      }
    }
  }

  return indexes;
}

export function fillRandomEmptyPlaces(field) {
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

  if (emptyPositions.length === 0) {
    if (messageStartLose) {
      messageStartLose.classList.remove('hidden');
    }

    return field;
  }

  // Randomly select an empty position
  const randomIndex = Math.floor(Math.random() * emptyPositions.length);
  const { x, y } = emptyPositions[randomIndex];

  // Randomly decide whether to add 2 or 4
  const valueToAdd = Math.random() < 0.9 ? 2 : 4;

  field[x][y] = valueToAdd;

  return field;
}

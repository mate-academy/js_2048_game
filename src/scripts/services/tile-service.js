import * as matrix from '../utils/matrix-utils';

export const isAnyPositionEmpty = (stateGame) => {
  const flat = matrix.flatten(stateGame);

  return flat.some((v) => v === 0);
};

const getEmptyPositions = (stateGame) => {
  const empties = [];

  matrix.forEachCell(stateGame, (value, idxRow, idxCell) => {
    if (value === 0) {
      empties.push([idxRow, idxCell]);
    }
  });

  return empties;
};

export const addRandomTile = (stateGame) => {
  const empties = getEmptyPositions(stateGame);

  if (empties.length === 0) {
    return stateGame;
  }

  const [row, cell] = empties[Math.floor(Math.random() * empties.length)];

  stateGame[row][cell] = Math.random() < 0.1 ? 4 : 2;

  return stateGame;
};

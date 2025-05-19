export const getRandomTwoOrFour = () => {
  return Math.random() > 0.9 ? 4 : 2;
};

export const getEmptyCells = (state) => {
  const emptyCells = [];

  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 4; y++) {
      if (state[x][y] === 0) {
        emptyCells.push([x, y]);
      }
    }
  }

  return emptyCells;
};

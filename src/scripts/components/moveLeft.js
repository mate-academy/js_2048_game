const moveLeft = (state) => {
  for (let i = 0; i < state.length; i += 1) {
    const line = state[i];
    const lastCell = [0, line[0]];
    let lastFreeCell = null;

    for (let j = 0; j < line.length; j += 1) {
      const num = line[j];

      if (num === 0) {
        if (lastFreeCell !== null) {
          continue;
        }
        lastFreeCell = j;

        continue;
      }

      if (lastCell[1] === num && lastCell[0] !== j) {
        state[i][lastCell[0]] = num * 2;
        state[i][j] = 0;
        lastFreeCell = j;
        lastCell[0] += 1;
        j -= 1;
        lastCell[1] = state[j][lastCell[0]];
        continue;
      }

      if (lastFreeCell !== null) {
        state[i][lastFreeCell] = num;
        lastCell[0] = lastFreeCell;
        lastCell[1] = num;
        lastFreeCell += 1;
        state[i][j] = 0;

        continue;
      }

      if (lastCell[1] !== num) {
        lastCell[0] += 1;
        lastCell[1] = num;
        continue;
      }
    }
  }

  return state;
};

export default moveLeft;

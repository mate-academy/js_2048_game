const moveUp = (state) => {
  for (let i = 0; i < state.length; i += 1) {
    const lastCell = [0, state[0][i]];
    let lastFreeCell = null;

    for (let j = 0; j < state.length; j += 1) {
      const num = state[j][i];

      if (num === 0) {
        if (lastFreeCell !== null) {
          continue;
        }
        lastFreeCell = j;
        continue;
      }

      if (lastCell[1] === num && lastCell[0] !== j) {
        state[lastCell[0]][i] = num * 2;
        state[j][i] = 0;
        lastFreeCell = j;
        lastCell[0] += 1;
        j -= 1;
        lastCell[1] = state[lastCell[0]][i];

        continue;
      }

      if (lastFreeCell !== null) {
        state[lastFreeCell][i] = num;
        lastCell[0] = lastFreeCell;
        lastCell[1] = num;
        lastFreeCell += 1;
        state[j][i] = 0;
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

export default moveUp;

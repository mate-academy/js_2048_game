/* eslint-disable max-len */
'use strict';
// #region start game

function getRandomIndexEmptyCells(currentIndexEmptyCells, gameStatus) {
  let firstNum;
  let secondNum;

  if (currentIndexEmptyCells.length === 0) {
    return [];
  }

  if (gameStatus === 'playing') {
    do {
      firstNum = Math.floor(Math.random() * 16);
    } while (!currentIndexEmptyCells.includes(firstNum));

    return [firstNum];
  }

  do {
    firstNum = Math.floor(Math.random() * 16);
    secondNum = Math.floor(Math.random() * 16);
  } while (
    !currentIndexEmptyCells.includes(firstNum) ||
    !currentIndexEmptyCells.includes(secondNum) ||
    firstNum === secondNum
  );

  return [firstNum, secondNum];
}

function getIndexEmptyCells(state) {
  const indexEmptyCells = [];

  state.flat().forEach((num, i) => {
    if (num === 0) {
      indexEmptyCells.push(i);
    }
  });

  return indexEmptyCells;
}

function getNewFlatState(currentState, randomIndexEmptyCells) {
  const newFlatState = [];

  currentState.flat().forEach((num, i) => {
    if (randomIndexEmptyCells.includes(i)) {
      newFlatState.push(getProbabilityFour());
    } else {
      newFlatState.push(num);
    }
  });

  return newFlatState;
}

function setCells(flatState) {
  const cells = [...document.getElementsByClassName('field-cell')];

  cells.forEach((cell, i) => {
    cell.textContent = '';
    cell.className = 'field-cell';

    if (flatState[i]) {
      cell.textContent = flatState[i];
      cell.classList.add(`field-cell--${flatState[i]}`);
    }
  });
}

function getTwoDimensionalState(flatState) {
  const twoDimensionalState = [];
  let start = 0;

  for (let i = 1; i <= flatState.length; i++) {
    if (i % 4 === 0) {
      twoDimensionalState.push(flatState.slice(start, i));
      start = i;
    }
  }

  return twoDimensionalState;
}

function getProbabilityFour() {
  if (Math.floor(Math.random() * 10) === 0) {
    return 4;
  } else {
    return 2;
  }
}
// #endregion start game

// #region move cells

function moveVertically(state, down = false) {
  const newState = [[], [], [], []];

  state.forEach((_, i) => {
    const column = Array.from({ length: 4 }, (__, j) => state[j][i]);

    if (down) {
      column.reverse();
    }

    const itemsInColumn = column.filter((cell) => cell);

    if (column.every((cell) => !cell)) {
      newState.forEach((row) => row.push(0));
    }

    if (itemsInColumn.length === 1) {
      column.sort((a, b) => b - a);
      newState.forEach((row, j) => row.push(column[j]));
    }

    if (itemsInColumn.length > 1) {
      const newCol = compareAdjacentCells(itemsInColumn).filter((cell) => cell);

      newState.forEach((row, j) => row.push(newCol[j] || 0));
    }
  });

  if (down) {
    newState.reverse();
  }

  return newState;
}

function moveHorizontally(state, right = false) {
  const newState = [[], [], [], []];

  state.forEach((_, i) => {
    const row = Array.from({ length: 4 }, (__, j) => state[i][j]);

    if (right) {
      row.reverse();
    }

    const itemsInRow = row.filter((cell) => cell);

    if (row.every((cell) => !cell)) {
      row.forEach(() => newState[i].push(0));
    }

    if (itemsInRow.length === 1) {
      newState[i] = row.sort((a, b) => b - a);
    }

    if (itemsInRow.length > 1) {
      const newRow = compareAdjacentCells(itemsInRow).filter((cell) => cell);

      for (let j = 0; j < 4; j++) {
        newState[i].push(newRow[j] || 0);
      }
    }
  });

  if (right) {
    newState.forEach((row) => row.reverse());
  }

  return newState;
}

function compareAdjacentCells(line) {
  const newLine = Array(4).fill(0);

  for (let i = 0; i < line.length; ) {
    if (line[i] === line[i + 1]) {
      newLine[i] = line[i] + line[i + 1];
      i += 2;
    } else {
      newLine[i] = line[i];
      i++;
    }
  }

  return newLine;
}

// #endregion move cells

class Game {
  gameStatus = 'idle';
  currentState = [];
  startState = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(initialState) {
    // eslint-disable-next-line no-console
    console.log(initialState);
  }

  moveLeft() {
    const newState = moveHorizontally(this.currentState);

    if (JSON.stringify(this.currentState) === JSON.stringify(newState)) {
      return;
    }

    this.getState(newState);
  }

  moveRight() {
    const newState = moveHorizontally(this.currentState, true);

    if (JSON.stringify(this.currentState) === JSON.stringify(newState)) {
      return;
    }

    this.getState(newState);
  }

  moveUp() {
    const newState = moveVertically(this.currentState);

    if (JSON.stringify(this.currentState) === JSON.stringify(newState)) {
      return;
    }

    this.getState(newState);
  }

  moveDown() {
    const newState = moveVertically(this.currentState, true);

    if (JSON.stringify(this.currentState) === JSON.stringify(newState)) {
      return;
    }

    this.getState(newState);
  }

  /**
   * @returns {number}
   */
  getScore() {}

  /**
   * @returns {number[][]}
   */
  getState(state) {
    const indexEmptyCells = getIndexEmptyCells(state);

    const randomIndexEmptyCells = getRandomIndexEmptyCells(
      indexEmptyCells,
      this.gameStatus,
    );

    const newFlatState = getNewFlatState(state, randomIndexEmptyCells);

    this.currentState = getTwoDimensionalState(newFlatState);
    setCells(newFlatState);
    this.searchMoveOpportunity(newFlatState, this.currentState);
    this.search2048Cell(newFlatState);
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    return this.gameStatus;
  }

  start() {
    this.getState(this.startState);
    this.gameStatus = 'playing';
  }

  restart() {
    this.gameStatus = 'idle';
    this.getState(this.startState);
    this.gameStatus = 'playing';
  }

  // Add your own methods here
  searchMoveOpportunity(flatState, state) {
    if (flatState.every((cell) => cell)) {
      let hasEqualCells = false;

      for (let i = 0; i < state.length; i++) {
        const column = Array.from({ length: 4 }, (__, j) => state[j][i]);
        const row = Array.from({ length: 4 }, (__, j) => state[i][j]);

        if (
          column.some((cell, j) => j > 0 && cell === column[j - 1]) ||
          row.some((cell, j) => j > 0 && cell === row[j - 1])
        ) {
          hasEqualCells = true;
        }
      }

      if (!hasEqualCells) {
        this.gameStatus = 'lose';
      }
    }
  }

  search2048Cell(flatState) {
    flatState.forEach((cell) => {
      if (cell === 2048) {
        this.gameStatus = 'win';
      }
    });
  }
}

export default Game;

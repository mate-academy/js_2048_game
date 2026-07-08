'use strict';

class Game {
  constructor(initialState, rowsCount = 4, colsCount = 4) {
    if (initialState == null) {
      this.initialState = createEmptyBoard(rowsCount, colsCount);
    } else {
      this.initialState = initialState;
    }

    this.state = cloneBoard(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    const { state, score, newStatus } = performMove(
      this.state,
      this.score,
      this.status,
      'start',
      false,
    );

    this.state = state;
    this.score = score;
    this.status = newStatus;
  }
  moveRight() {
    const { state, score, newStatus } = performMove(
      this.state,
      this.score,
      this.status,
      'end',
      false,
    );

    this.state = state;
    this.score = score;
    this.status = newStatus;
  }
  moveUp() {
    const { state, score, newStatus } = performMove(
      this.state,
      this.score,
      this.status,
      'start',
      true,
    );

    this.state = state;
    this.score = score;
    this.status = newStatus;
  }
  moveDown() {
    const { state, score, newStatus } = performMove(
      this.state,
      this.score,
      this.status,
      'end',
      true,
    );

    this.state = state;
    this.score = score;
    this.status = newStatus;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.state = addStartTiles(this.state);
  }

  restart() {
    this.score = 0;
    this.state = cloneBoard(this.initialState);
    this.status = 'idle';
  }
}

function addStartTiles(state) {
  const newState = cloneBoard(state);
  const rowsCount = newState.length;
  const colsCount = newState[0].length;
  const cellPool = [];

  for (let i = 0; i < rowsCount * colsCount; i++) {
    cellPool.push(i);
  }

  cellPool.sort(() => Math.random() - 0.5);

  const firstCell = cellPool[0];
  const secondCell = cellPool[1];

  const row1 = Math.floor(firstCell / colsCount);
  const col1 = firstCell % colsCount;

  const row2 = Math.floor(secondCell / colsCount);
  const col2 = secondCell % colsCount;

  newState[row1][col1] = Math.random() < 0.9 ? 2 : 4;
  newState[row2][col2] = Math.random() < 0.9 ? 2 : 4;

  return newState;
}

function mergeLine(row, direction = 'start') {
  const rowLength = row.length;
  const rowClone = [...row];
  const newRow = Array(rowLength).fill(0);

  if (direction === 'end') {
    rowClone.reverse();
  }

  let newScore = 0;
  let writeIndex = 0;

  for (let i = 0; i < rowLength; i++) {
    if (rowClone[i] === 0) {
      continue;
    }

    if (newRow[writeIndex] === 0) {
      newRow[writeIndex] = rowClone[i];
    } else if (newRow[writeIndex] === rowClone[i]) {
      newRow[writeIndex] *= 2;
      newScore += newRow[writeIndex];
      writeIndex++;
    } else {
      writeIndex++;
      newRow[writeIndex] = rowClone[i];
    }
  }

  if (direction === 'end') {
    newRow.reverse();
  }

  return { row: newRow, score: newScore };
}

function addRandomTileAfterMove(state) {
  const newState = cloneBoard(state);
  const rowsCount = newState.length;
  const colsCount = newState[0].length;
  const emptyCells = [];

  for (let row = 0; row < rowsCount; row++) {
    for (let col = 0; col < colsCount; col++) {
      if (newState[row][col] === 0) {
        emptyCells.push(row * colsCount + col);
      }
    }
  }

  if (emptyCells.length === 0) {
    return newState;
  }

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const targetCell = emptyCells[randomIndex];

  const targetRow = Math.floor(targetCell / colsCount);
  const targetCol = targetCell % colsCount;

  newState[targetRow][targetCol] = Math.random() < 0.9 ? 2 : 4;

  return newState;
}

function transpose(state) {
  const rowsCount = state.length;
  const colsCount = state[0].length;

  const result = Array(colsCount)
    .fill(0)
    .map(() => Array(rowsCount).fill(0));

  for (let row = 0; row < rowsCount; row++) {
    for (let col = 0; col < colsCount; col++) {
      result[col][row] = state[row][col];
    }
  }

  return result;
}

function performMove(
  state,
  score,
  oldStatus,
  mergeSide,
  shouldTranspose = false,
) {
  if (oldStatus !== 'playing') {
    return {
      state: state,
      score: score,
      newStatus: oldStatus,
    };
  }

  const newState = [];
  const workingState = shouldTranspose ? transpose(state) : state;
  let newScore = score;

  for (let i = 0; i < workingState.length; i++) {
    const obj = mergeLine(workingState[i], mergeSide);

    newState[i] = obj.row;
    newScore += obj.score;
  }

  const finalState = shouldTranspose ? transpose(newState) : newState;

  const oldStateText = JSON.stringify(state);
  const newStateText = JSON.stringify(finalState);

  if (oldStateText !== newStateText) {
    const stateAfterMove = addRandomTileAfterMove(finalState);

    const newStatus = getBoardStatus(stateAfterMove);

    return {
      state: stateAfterMove,
      score: newScore,
      newStatus: newStatus,
    };
  } else {
    return {
      state: state,
      score: score,
      newStatus: oldStatus,
    };
  }
}

function getBoardStatus(state) {
  const rowsCount = state.length;
  const colsCount = state[0].length;
  let hasMove = false;

  for (let row = 0; row < rowsCount; row++) {
    for (let col = 0; col < colsCount; col++) {
      const current = state[row][col];

      if (current === 2048) {
        return 'win';
      }

      if (current === 0) {
        hasMove = true;
      }

      if (row + 1 < rowsCount && state[row + 1][col] === current) {
        hasMove = true;
      }

      if (col + 1 < colsCount && state[row][col + 1] === current) {
        hasMove = true;
      }
    }
  }

  return hasMove ? 'playing' : 'lose';
}

function createEmptyBoard(rowsCount = 4, colsCount = 4) {
  return Array(rowsCount)
    .fill(0)
    .map(() => Array(colsCount).fill(0));
}

function cloneBoard(board) {
  return board.map((row) => [...row]);
}

module.exports = Game;

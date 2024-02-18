'use strict';

const BOARD_SIZE = 4;

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
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
  constructor(initialState = this.getNewBoard()) {
    this.state = initialState;
    this.initialState = this.copyState(initialState);
    this.prevState = this.copyState(this.state);
    this.status = 'idle';
    this.score = 0;
    this.isWin = false;
  }

  moveLeft() {
    const move = () => {
      for (let i = 0; i < BOARD_SIZE; i++) {
        const col = this.state[i];
        const movedCol = this.moveLine(col);

        this.state[i] = movedCol;
      }
    };

    this.makeMove(move);
  }

  moveRight() {
    const move = () => {
      for (let i = 0; i < BOARD_SIZE; i++) {
        const col = this.state[i].reverse();
        const movedCol = this.moveLine(col);

        this.state[i] = movedCol.reverse();
      }
    };

    this.makeMove(move);
  }

  moveUp() {
    const move = () => {
      for (let rowIndex = 0; rowIndex < BOARD_SIZE; rowIndex++) {
        const row = this.getRow(rowIndex);
        const movedRow = this.moveLine(row);

        this.changeRow(movedRow, rowIndex);
      }
    };

    this.makeMove(move);
  }

  moveDown() {
    const move = () => {
      for (let rowIndex = 0; rowIndex < BOARD_SIZE; rowIndex++) {
        const row = this.getRow(rowIndex);
        const movedRow = this.moveLine(row.reverse());

        this.changeRow(movedRow.reverse(), rowIndex);
      }
    };

    this.makeMove(move);
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  updateScore(cellNumber) {
    this.score += cellNumber;
  }

  getLineSum(arr) {
    const sum = arr.reduce((a, b) => a + b, 0);

    return sum;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.state;
  }

  getPrevState() {
    return this.prevState;
  }

  setPrevState() {
    this.prevState = this.copyState(this.state);
  }

  copyState(state) {
    return state.map(line => [...line]);
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
    return this.status;
  }

  setStatus(newStatus) {
    this.status = newStatus;
  }

  updateStatus() {
    if (this.isLose()) {
      this.setStatus('lose');
    }

    if (this.isWin) {
      this.setStatus('win');
    }
  }

  /**
   * Starts the game.
   */
  start() {
    this.addRandomCell();
    this.addRandomCell();
    this.setStatus('playing');
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = this.copyState(this.initialState);
    this.score = 0;
    this.setStatus('idle');
  }

  getNewBoard() {
    return [...Array(BOARD_SIZE)].map(() => Array(BOARD_SIZE).fill(0));
  }

  makeMove(move) {
    const gameStatus = this.getStatus();

    if (gameStatus === 'idle' || gameStatus === 'lose') {
      return;
    }

    this.setPrevState();

    move();

    if (this.isMoved(this.getPrevState())) {
      this.addRandomCell();
    }

    this.updateStatus();
  }

  moveLine(lineArr) {
    const getOutZeroes = lineArr.filter(elem => elem !== 0);
    const newLine = getOutZeroes;

    for (let i = 0; i < newLine.length; i++) {
      const curr = newLine[i];
      const next = newLine[i + 1];

      if (curr === next) {
        const newCell = curr + next;

        newLine.splice(i, 1, newCell);
        newLine.splice(i + 1, 1);
        this.updateScore(curr + next);

        if (newCell === 2048) {
          this.isWin = true;
        }
      }
    }

    while (newLine.length !== BOARD_SIZE) {
      newLine.push(0);
    }

    return newLine;
  }

  addRandomCell() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length !== 0) {
      const anyIndex = Math.floor(Math.random() * emptyCells.length);
      const anyPosition = emptyCells[anyIndex];
      const randomValue = Math.random() < 0.9 ? 2 : 4;

      this.state[anyPosition.rowIndex][anyPosition.colIndex] = randomValue;
    }
  }

  getRow(rowIndex) {
    const row = [];

    for (let colIndex = 0; colIndex < BOARD_SIZE; colIndex++) {
      const col = this.state[colIndex];
      const elem = col[rowIndex];

      row.push(elem);
    }

    return row;
  }

  changeRow(rowToPlace, rowIndex) {
    for (let colIndex = 0; colIndex < BOARD_SIZE; colIndex++) {
      this.state[colIndex][rowIndex] = rowToPlace[colIndex];
    }
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let rowIndex = 0; rowIndex < BOARD_SIZE; rowIndex++) {
      for (let colIndex = 0; colIndex < BOARD_SIZE; colIndex++) {
        const cell = this.state[rowIndex][colIndex];

        if (cell === 0) {
          emptyCells.push({
            rowIndex, colIndex,
          });
        }
      }
    }

    return emptyCells;
  }

  isMoved(prevState) {
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        const prevCell = prevState[r][c];
        const currCell = this.state[r][c];

        if (prevCell !== currCell) {
          return true;
        }
      }
    }

    return false;
  }

  isLose() {
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        const currCell = this.state[r][c];
        const nextCell = r + 1 < BOARD_SIZE ? this.state[r + 1][c] : -1;
        const bottomCell = c + 1 < BOARD_SIZE ? this.state[r][c + 1] : -1;

        const emptyCell = currCell === 0 || nextCell === 0 || bottomCell === 0;
        const areCellsEqual = currCell === nextCell | currCell === bottomCell;

        if (areCellsEqual || emptyCell) {
          return false;
        }
      }
    }

    return true;
  }

  drawBoard(cells) {
    this.state.forEach((row, rowIndex) => {
      row.forEach((colValue, colIndex) => {
        const calculateCellIndex = rowIndex * BOARD_SIZE + colIndex;
        const cell = cells[calculateCellIndex];

        if (colValue !== 0) {
          cell.textContent = colValue;
          cell.classList = `field-cell field-cell--${colValue}`;
        } else {
          cell.textContent = null;
          cell.classList = `field-cell`;
        }
      });
    });
  }
}

module.exports = Game;

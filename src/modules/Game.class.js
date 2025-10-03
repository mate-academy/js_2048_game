'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
export default class Game {
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
  constructor(
    initialState,
    startBtn,
    scoreEl,
    cells,
    msgStart,
    msgWin,
    msgLose,
  ) {
    // eslint-disable-next-line no-console
    this.startBtn = startBtn;
    this.scoreEl = scoreEl;
    this.cells = cells;

    this.msgStart = msgStart;
    this.msgWin = msgWin;
    this.msgLose = msgLose;

    this.size = 4;
    this.grid = initialState || this.createEmptyGrid();
    this.status = 'idle';
    this.isFirstMove = true;
    this.score = 0;
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const gridBeforeMove = JSON.stringify(this.grid);

    const { newGrid, scoreDelta } = this.combineTiles(
      JSON.parse(gridBeforeMove),
    );

    if (JSON.stringify(newGrid) !== gridBeforeMove) {
      this.grid = newGrid;
      this.score += scoreDelta;
      this.handleValidMove();
    }
  }
  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const gridBeforeMove = JSON.stringify(this.grid);
    const gridCopy = JSON.parse(gridBeforeMove);

    gridCopy.forEach((row) => row.reverse());

    const { newGrid, scoreDelta } = this.combineTiles(gridCopy);

    newGrid.forEach((row) => row.reverse());

    if (JSON.stringify(newGrid) !== gridBeforeMove) {
      this.grid = newGrid;
      this.score += scoreDelta;
      this.handleValidMove();
    }
  }
  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const gridBeforeMove = JSON.stringify(this.grid);
    let gridCopy = JSON.parse(gridBeforeMove);

    gridCopy = this.transpose(gridCopy);

    const { newGrid, scoreDelta } = this.combineTiles(gridCopy);
    const finalGrid = this.transpose(newGrid);

    if (JSON.stringify(finalGrid) !== gridBeforeMove) {
      this.grid = finalGrid;
      this.score += scoreDelta;
      this.handleValidMove();
    }
  }
  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const gridBeforeMove = JSON.stringify(this.grid);
    let gridCopy = JSON.parse(gridBeforeMove);

    gridCopy = this.transpose(gridCopy);
    gridCopy.forEach((row) => row.reverse());

    const { newGrid, scoreDelta } = this.combineTiles(gridCopy);

    newGrid.forEach((row) => row.reverse());

    const finalGrid = this.transpose(newGrid);

    if (JSON.stringify(finalGrid) !== gridBeforeMove) {
      this.grid = finalGrid;
      this.score += scoreDelta;
      this.handleValidMove();
    }
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.grid;
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

  updateStatus() {
    if (this.checkForWin()) {
      this.status = 'win';
    } else if (this.checkForLose()) {
      this.status = 'lose';
    }
    this.renderMessage();
  }
  checkForWin() {
    return this.grid.some((row) => row.some((cell) => cell === 2048));
  }

  checkForLose() {
    if (this.grid.some((row) => row.some((cell) => cell === 0))) {
      return false;
    }

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (c < this.size - 1 && this.grid[r][c] === this.grid[r][c + 1]) {
          return false;
        }

        if (r < this.size - 1 && this.grid[r][c] === this.grid[r + 1][c]) {
          return false;
        }
      }
    }

    return true;
  }

  createEmptyGrid() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  transpose(matrix) {
    return matrix[0].map((col, colIndex) => matrix.map((row) => row[colIndex]));
  }

  addRandomTile() {
    const emptyTiles = [];

    this.grid.forEach((row, r) => {
      return row.forEach((tile, c) => {
        if (tile === 0) {
          emptyTiles.push({ r, c });
        }
      });
    });

    if (emptyTiles.length > 0) {
      const { r, c } =
        emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

      this.grid[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  combineTiles(grid) {
    let scoreDelta = 0;
    const newGrid = [];

    for (const row of grid) {
      const newRow = row.filter((tile) => tile !== 0);

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          scoreDelta += newRow[i];
          newRow.splice(i + 1, 1);
        }
      }

      while (newRow.length < this.size) {
        newRow.push(0);
      }
      newGrid.push(newRow);
    }

    return { newGrid, scoreDelta };
  }

  handleValidMove() {
    if (this.isFirstMove) {
      this.startBtn.textContent = 'Restart';
      this.startBtn.classList.remove('start');
      this.startBtn.classList.add('restart');
      this.isFirstMove = false;
    }
    this.addRandomTile();
    this.render();
    this.updateStatus();
  }

  /**
   * Starts the game.
   */
  start() {
    this.grid = this.createEmptyGrid();
    this.isFirstMove = true;
    this.startBtn.textContent = 'Restart';
    this.startBtn.classList.remove('start');
    this.startBtn.classList.add('restart');
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
    this.render();
  }

  render() {
    this.scoreEl.textContent = this.score;

    this.grid.flat().forEach((value, index) => {
      const cell = this.cells[index];

      cell.textContent = value === 0 ? '' : value;
    });

    this.renderMessage();
  }

  renderMessage() {
    this.msgStart.classList.add('hidden');
    this.msgLose.classList.add('hidden');
    this.msgWin.classList.add('hidden');

    if (this.status === 'idle') {
      return this.msgStart.classList.remove('hidden');
    }

    if (this.status === 'win') {
      return this.msgWin.classList.remove('hidden');
    }

    if (this.status === 'lose') {
      return this.msgLose.classList.remove('hidden');
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    return this.start();
  }

  // Add your own methods here
}

module.exports = Game;

'use strict';

const Tile = require('./Tile.class');

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
  constructor(initialState) {
    this.boardSize = 4;

    this.board = initialState
      ? this.#createBoardFromState(initialState)
      : this.#createEmptyBoardWithTiles();
    this.score = 0;
    this.status = 'idle';
    this.winNumber = 2048;
    this.tiles = [];

    if (initialState) {
      for (let row = 0; row < this.boardSize; row++) {
        for (let col = 0; col < this.boardSize; col++) {
          if (this.board[row][col] instanceof Tile) {
            this.tiles.push(this.board[row][col]);
          }
        }
      }
    }
  }

  moveLeft() {
    this.#move('left');
  }

  moveRight() {
    this.#move('right');
  }
  moveUp() {
    this.#move('up');
  }
  moveDown() {
    this.#move('down');
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
    return this.board.map((row) => row.map((tile) => (tile ? tile.value : 0)));
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

  /**
   * Starts the game.
   */
  start() {
    this.status = 'playing';
    this.score = 0;
    this.board = this.#createEmptyBoardWithTiles();
    this.tiles = [];
    this.#addRandomTile();
    this.#addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = 'idle';
    this.start();
  }

  getTiles() {
    return [...this.tiles];
  }

  #createEmptyBoardWithTiles() {
    return Array.from({ length: this.boardSize }, () => {
      return Array(this.boardSize).fill(null);
    });
  }

  #createBoardFromState(initialState) {
    const boardWithTiles = this.#createEmptyBoardWithTiles();

    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        if (initialState[row][col] !== 0) {
          const tile = new Tile(initialState[row][col], row, col);

          boardWithTiles[row][col] = tile;
        }
      }
    }

    return boardWithTiles;
  }

  #getEmptyCells() {
    const emptyCells = [];

    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        if (this.board[row][col] === null) {
          emptyCells.push({ row, col });
        }
      }
    }

    return emptyCells;
  }

  #addRandomTile() {
    const emptyCells = this.#getEmptyCells();

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];
    const newValue = Math.random() < 0.9 ? 2 : 4;

    const newTile = new Tile(newValue, row, col);

    this.board[row][col] = newTile;
    this.tiles.push(newTile);
  }

  #slideAndMergeLine(line) {
    let changed = false;
    let mergerScore = 0;
    const newTilesInLine = [];
    const mergedTilesIds = new Set();

    const activeTiles = line.filter((tile) => tile !== null);

    for (let i = 0; i < activeTiles.length; i++) {
      const currentTile = activeTiles[i];
      let foundMerge = false;

      if (
        i + 1 < activeTiles.length &&
        activeTiles[i + 1].value === currentTile.value &&
        !mergedTilesIds.has(currentTile.id) &&
        !mergedTilesIds.has(activeTiles[i + 1])
      ) {
        const mergedValue = currentTile.value * 2;

        mergerScore += mergedValue;
        changed = true;

        const newTile = new Tile(mergedValue, currentTile.row, currentTile.col);

        newTile.mergedFrom = [currentTile, activeTiles[i + 1]];

        newTilesInLine.push(newTile);
        mergedTilesIds.add(currentTile.id);
        mergedTilesIds.add(activeTiles[i + 1].id);

        i++;
        foundMerge = true;
      }

      if (!foundMerge && !mergedTilesIds.has(currentTile.id)) {
        newTilesInLine.push(currentTile);
      }
    }

    while (newTilesInLine.length < this.boardSize) {
      newTilesInLine.push(null);
    }

    return { newLine: newTilesInLine, mergerScore, changed };
  }

  #move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    this.tiles.forEach((tile) => tile.savePosition());

    let boardChanged = false;
    let currentMoveScore = 0;
    const oldBoard = this.#createEmptyBoardWithTiles();

    this.tiles.forEach((tile) => {
      oldBoard[tile.row][tile.col] = tile;
    });

    const newBoard = this.#createEmptyBoardWithTiles();
    const tilesToRemove = new Set();

    if (direction === 'left' || direction === 'right') {
      for (let row = 0; row < this.boardSize; row++) {
        const originalLine = [...this.board[row]];
        const processedLine =
          direction === 'right' ? originalLine.reverse() : originalLine;
        const { newLine, mergerScore } = this.#slideAndMergeLine(processedLine);

        currentMoveScore += mergerScore;

        const finalLine =
          direction === 'right' ? [...newLine].reverse() : newLine;

        finalLine.forEach((tile, col) => {
          if (tile) {
            tile.updatePosition(row, col);
            newBoard[row][col] = tile;

            if (tile.mergedFrom) {
              tile.mergedFrom.forEach((mergedTile) => {
                return tilesToRemove.add(mergedTile.id);
              });
            }
          }
        });
      }
    } else {
      for (let col = 0; col < this.boardSize; col++) {
        const originalLine = [];

        for (let row = 0; row < this.boardSize; row++) {
          originalLine.push(this.board[row][col]);
        }

        const processedLine =
          direction === 'down' ? [...originalLine].reverse() : originalLine;

        const { newLine, mergerScore } = this.#slideAndMergeLine(processedLine);

        currentMoveScore += mergerScore;

        const finalLine =
          direction === 'down' ? [...newLine].reverse() : newLine;

        finalLine.forEach((tile, row) => {
          if (tile) {
            tile.updatePosition(row, col);
            newBoard[row][col] = tile;

            if (tile.mergedFrom) {
              tile.mergedFrom.forEach((mergedTile) => {
                return tilesToRemove.add(mergedTile.id);
              });
            }
          }
        });
      }
    }

    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        const oldTile = oldBoard[row][col];
        const newTile = newBoard[row][col];

        if (oldTile !== newTile) {
          boardChanged = true;
          break;
        }
      }
    }
    this.board = newBoard;
    this.tiles = this.tiles.filter((tile) => !tilesToRemove.has(tile.id));

    const uniqueTilesInNewBoard = new Set();

    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        if (this.board[row][col]) {
          uniqueTilesInNewBoard.add(this.board[row][col]);
        }
      }
    }
    this.tiles = Array.from(uniqueTilesInNewBoard);

    if (boardChanged) {
      this.score += currentMoveScore;
      this.#addRandomTile();
      this.#checkGameStatus();
    }
  }

  #checkWinCondition() {
    if (this.status === 'playing') {
      for (let row = 0; row < this.boardSize; row++) {
        for (let col = 0; col < this.boardSize; col++) {
          if (this.board[row][col] === this.winNumber) {
            this.status = 'win';

            return;
          }
        }
      }
    }
  }

  #isGameOver() {
    if (this.#getEmptyCells().length > 0) {
      return false;
    }

    const tempBoardForCheck = this.#createEmptyBoardWithTiles();

    this.tiles.forEach((tile) => {
      tempBoardForCheck[tile.row][tile.col] = new Tile(
        tile.value,
        tile.row,
        tile.col,
      );
    });

    for (let row = 0; row < this.boardSize; row++) {
      const originalLine = tempBoardForCheck[row].slice();
      const { changed } = this.#slideAndMergeLine(originalLine);

      if (changed) {
        return false;
      }
    }

    for (let col = 0; col < this.boardSize; col++) {
      const originalCol = [];

      for (let row = 0; row < this.boardSize; row++) {
        originalCol.push(tempBoardForCheck[row][col]);
      }

      const { changed } = this.#slideAndMergeLine(originalCol);

      if (changed) {
        return false;
      }
    }

    return true;
  }

  #checkGameStatus() {
    if (this.status === 'win' || this.status === 'lose') {
      return;
    }
    this.#checkWinCondition();

    if (this.status === 'win') {
      return;
    }

    if (this.#isGameOver()) {
      this.status = 'lose';
    }
  }
}

module.exports = Game;

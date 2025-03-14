'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */

class Cell {
  constructor(numCell, value) {
    this.numCell = numCell;
    this.value = value;
  }

  get coordRow() {
    return Math.floor(this.numCell / WIDTH);
  }

  get coordColumn() {
    return this.numCell % WIDTH;
  }
}

const WIDTH = 4;
const TRUE = true;
const FALSE = false;
const ONE_MERGE = 1;
const TWO_MERGE = 2;

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
  static INITIAL_STATE = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  static ARRAY_STATUS = ['idle', 'playing', 'win', 'lose'];
  static PROBABILITY_FOUR = 0.1;

  status = 'idle';
  score = 0;
  tiles = [];
  arrayTwoFour = [];

  constructor(initialState = Game.INITIAL_STATE) {
    // eslint-disable-next-line no-console
    console.log(initialState);
    this.initialState = initialState;
    this.board = this.copyState(initialState);
  }

  moveLeft() {
    this.makeMove('left');
  }

  moveRight() {
    this.makeMove('right');
  }

  moveUp() {
    this.makeMove('up');
  }

  moveDown() {
    this.makeMove('down');
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
    return this.copyState(this.board);
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
    if (this.status === 'playing') {
      if (
        this.arrayCells.every((cell) => cell > 0) &&
        !this.isEqualAdjancedCells()
      ) {
        this.status = `lose`;
      }

      if (this.maxNumberInBoard === 2048) {
        this.status = `win`;
      }
    }

    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.tiles = this.getTiles();
    this.getRandomCell();
    this.getRandomCell();
    this.tiles = this.getTiles();
    this.status = 'playing';
    this.tileArrays = this.getTileArrays();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.copyState(this.initialState);
    this.status = 'idle';
    this.score = 0;
  }

  // Add your own methods here
  get arrayCells() {
    return this.board.flat();
  }

  getTileArrays() {
    return this.board.map((row) => row.filter((cell) => cell > 0));
  }

  get maxNumberInBoard() {
    return Math.max(...this.arrayCells);
  }

  copyState(state) {
    return state.map((row) => [...row]);
  }

  makeMove(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const coordName =
      direction === 'left' || direction === 'right'
        ? 'coordRow'
        : 'coordColumn';

    const isReverseOfCells =
      direction === 'right' || direction === 'down' ? TRUE : FALSE;

    this.saveStateBeforeMove(coordName);

    switch (direction) {
      case 'left':
        this.justMoveLeft();
        break;

      case 'right':
        this.justMoveRight();
        break;

      case 'up':
        this.justMoveUp();
        break;

      case 'down':
        this.justMoveDown();
        break;
    }

    this.actAfterMove(coordName, isReverseOfCells);
  }

  justMoveLeft() {
    this.shiftCells();
    this.getTilesAfterShift('coordRow');
    this.mergeAndShiftCells();
  }

  justMoveRight() {
    this.reverseCells();
    this.shiftCells();
    this.reverseCells();
    this.getTilesAfterShift('coordRow');

    this.reverseCells();
    this.mergeAndShiftCells();
    this.reverseCells();
  }

  justMoveUp() {
    this.convertColumnsToLines();
    this.shiftCells();
    this.convertColumnsToLines();

    this.getTilesAfterShift('coordColumn');

    this.convertColumnsToLines();
    this.mergeAndShiftCells();
    this.convertColumnsToLines();
  }

  justMoveDown() {
    this.convertColumnsToLines();
    this.reverseCells();
    this.shiftCells();
    this.reverseCells();
    this.convertColumnsToLines();

    this.getTilesAfterShift('coordColumn');

    this.convertColumnsToLines();
    this.reverseCells();
    this.mergeAndShiftCells();
    this.reverseCells();
    this.convertColumnsToLines();
  }

  convertColumnsToLines() {
    const lines = [];

    for (let x = 0; x < WIDTH; x++) {
      const line = [];

      for (let y = 0; y < WIDTH; y++) {
        line.push(this.board[y][x]);
      }
      lines.push(line);
    }
    this.board = this.copyState(lines);
  }

  reverseCells() {
    this.board.forEach((row) => row.reverse());
  }

  shiftCells() {
    const shiftedRows = this.board.map((row) => {
      return row.filter((cell) => cell !== 0);
    });

    shiftedRows.forEach((filteredRow) => {
      const lengthRow = filteredRow.length;

      if (lengthRow < WIDTH) {
        filteredRow.push(...Array(WIDTH - lengthRow).fill(0));
      }
    });

    this.board = this.copyState(shiftedRows);
  }

  mergeAndShiftCells() {
    this.mergeCells();
    this.shiftCells();
  }

  getTilesAfterShift(coordName) {
    this.tiles = this.getTiles();
    this.tilesAfterShift = this.groupTilesByColumnsOrRows(coordName).flat();
  }

  getTiles() {
    const objectCells = this.arrayCells.map((cell, i) => new Cell(i, cell));

    return objectCells.filter((cell) => cell.value > 0);
  }

  groupTilesByColumnsOrRows(coordName) {
    const tilesByLines = [];

    for (let line = 0; line < WIDTH; line++) {
      tilesByLines.push(this.tiles.filter((tile) => tile[coordName] === line));
    }

    return tilesByLines;
  }

  getMergeAndActiveTiles() {
    const tilesFilledOne = this.tilesBeforeMove.map((tileBeforeMove) => {
      return Array(tileBeforeMove.length).fill(1);
    });

    return tilesFilledOne.map((lineTiles, j) => {
      if (!lineTiles.length || !this.indexesForRemove[j].length) {
        return lineTiles;
      }

      return lineTiles.map((tile, i) => {
        for (let k = 0; k < this.indexesForRemove[j].length; k++) {
          if (i === this.indexesForRemove[j][k]) {
            return 0;
          }
        }

        return tile;
      });
    });
  }

  mergeCells() {
    this.board.forEach((row) => {
      if (!row[0] || !row[1]) {
        return row;
      }

      if (row[0] === row[1]) {
        this.mergeTwoCells(row, 0);
      } else {
        if (row[1] === row[2]) {
          this.mergeTwoCells(row, 1);
        }
      }

      if (row[2] === row[3]) {
        this.mergeTwoCells(row, 2);
      }

      return row;
    });
  }

  mergeTwoCells(arr, i) {
    arr[i] += arr[i + 1];
    arr[i + 1] = 0;
    this.addScore(arr[i]);
  }

  addScore(num) {
    this.score += num;
  }

  getRandomCell() {
    this.getEmptyCells();
    this.getNumberRandomCell();
    this.fillRandomCell();
  }

  getNumberRandomCell() {
    const emptyCells = this.getEmptyCells();

    const index = Math.floor(Math.random() * emptyCells.length);

    return emptyCells[index];
  }

  getEmptyCells() {
    const arrayOfIndexes = this.arrayCells.map((cell, index) => {
      if (cell === 0) {
        return index;
      } else {
        return -1;
      }
    });

    return arrayOfIndexes.filter((cell) => cell >= 0);
  }

  fillRandomCell() {
    const numberCell = this.getNumberRandomCell();
    const valueCell = this.getNumberTwoOrFour();

    this.randomCell = new Cell(numberCell, valueCell);

    const numRow = this.randomCell.coordRow;
    const numColumn = this.randomCell.coordColumn;

    this.board[numRow][numColumn] = valueCell;
  }

  getArrayTwoFour(ratio) {
    const lengthArr = Math.round(1 / ratio);

    const firstArray = Array(lengthArr).fill(2);

    this.arrayTwoFour.push(...firstArray);

    const indexFour = Math.floor(Math.random() * lengthArr);

    this.arrayTwoFour[indexFour] = 4;
  }

  getNumberTwoOrFour() {
    const probability = Game.PROBABILITY_FOUR;

    if (!this.arrayTwoFour.length) {
      this.getArrayTwoFour(probability);
    }

    const result = this.arrayTwoFour[this.arrayTwoFour.length - 1];

    this.arrayTwoFour.pop();

    return result;
  }

  isChange() {
    if (this.arrayCells.length !== this.arrayCellsBeforeMove.length) {
      return true;
    }

    for (let i = 0; i < this.arrayCells.length; i++) {
      if (this.arrayCells[i] !== this.arrayCellsBeforeMove[i]) {
        return true;
      }
    }

    return false;
  }

  isEqualAdjancedCells() {
    for (let y = 0; y < WIDTH; y++) {
      for (let x = 0; x < WIDTH - 1; x++) {
        if (this.board[y][x] === this.board[y][x + 1]) {
          return true;
        }
      }
    }

    for (let x = 0; x < WIDTH; x++) {
      for (let y = 0; y < WIDTH - 1; y++) {
        if (this.board[y][x] === this.board[y + 1][x]) {
          return true;
        }
      }
    }

    return false;
  }

  saveStateBeforeMove(coordName) {
    this.arrayCellsBeforeMove = [...this.arrayCells];

    this.tilesBeforeMove = this.groupTilesByColumnsOrRows(coordName);
  }

  saveStateAfterMove(coordName) {
    this.tiles = this.getTiles();

    this.tilesAfterMove = this.groupTilesByColumnsOrRows(coordName);

    this.tilesActive = this.tilesAfterMove.flat();
  }

  reverseTilesBeforeMove() {
    this.tilesBeforeMoveReverse = this.copyState(this.tilesBeforeMove);

    this.tilesBeforeMoveReverse.forEach((line) => line.reverse());
  }

  actAfterMove(coordName, isReverseOfCells) {
    this.changeAfterMove = this.isChange();

    if (!this.changeAfterMove) {
      return;
    }

    this.saveStateAfterMove(coordName);

    this.recognizeMergeAndActiveTiles(
      this.tilesBeforeMove,
      this.tilesAfterMove,
      isReverseOfCells,
    );

    this.addNewTile();
  }

  recognizeMergeAndActiveTiles(
    linesBeforeMove,
    linesAfterMove,
    isReverseOfCells = false,
  ) {
    this.indexesForRemove = this.getIndexesMergeTiles(
      linesBeforeMove,
      linesAfterMove,
    );

    if (isReverseOfCells) {
      this.indexesForRemove.forEach((line) => line.reverse());
    }

    this.mergeAndActiveTiles = this.getMergeAndActiveTiles().flat();
  }

  getIndexesMergeTiles(linesBeforeMove, linesAfterMove) {
    return linesBeforeMove.map((lineBeforeMove, n) => {
      const indexesTileInLineForRemove = [];
      const numberOfTilesBefore = lineBeforeMove.length;
      const numberOfTilesAfter = linesAfterMove[n].length;
      const numberOfMerge = numberOfTilesBefore - numberOfTilesAfter;

      switch (numberOfMerge) {
        case ONE_MERGE:
          if (
            (numberOfTilesBefore === 2 ||
              numberOfTilesBefore === 3 ||
              numberOfTilesBefore === 4) &&
            lineBeforeMove[0].value === lineBeforeMove[1].value
          ) {
            indexesTileInLineForRemove.push(0);
            break;
          }

          if (
            numberOfTilesBefore === 3 ||
            (numberOfTilesBefore === 4 &&
              lineBeforeMove[1].value === lineBeforeMove[2].value)
          ) {
            indexesTileInLineForRemove.push(1);
            break;
          }

          if (lineBeforeMove[2].value === lineBeforeMove[3].value) {
            indexesTileInLineForRemove.push(2);
          }

          break;
        case TWO_MERGE:
          indexesTileInLineForRemove.push(0, 2);
          break;

        default:
          break;
      }

      return indexesTileInLineForRemove;
    });
  }

  addNewTile() {
    this.getRandomCell();
    this.tiles.push(this.randomCell);
    this.tiles.sort((tile1, tile2) => tile1.numCell - tile2.numCell);
  }
}

module.exports = Game;

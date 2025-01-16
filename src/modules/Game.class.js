'use strict';

export default class Game {
  constructor(initialState = null) {
    this.gridSize = 4;

    this.probabilityOfFour = 10;

    this.gameStatus = {
      isRunning: false,
      isGameOver: false,
      isWon: false,
    };

    this.score = 0;

    this.gridState = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.initialGridState = structuredClone(this.gridState);
  }

  start() {
    if (this.gameStatus.isRunning) {
      return;
    }

    this.gameStatus.isRunning = true;

    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.score = 0;
    this.gridState = structuredClone(this.initialGridState);

    this.gameStatus.isRunning = false;
    this.gameStatus.isGameOver = false;
    this.gameStatus.isWon = false;
  }

  moveLeft() {
    this.processMove((row) => this.shiftAndMerge(row));
  }

  moveRight() {
    this.processMove((row) => this.shiftAndMerge(row.reverse()).reverse());
  }

  moveUp() {
    this.processMove((column) => this.shiftAndMerge(column), true);
  }

  moveDown() {
    this.processMove(
      (column) => this.shiftAndMerge(column.reverse()).reverse(),
      true,
    );
  }

  processMove(transformFn, isColumn = false) {
    if (!this.gameStatus.isRunning || this.gameStatus.isGameOver) {
      return;
    }

    const previousState = structuredClone(this.gridState);

    if (isColumn) {
      for (let j = 0; j < this.gridSize; j++) {
        const column = this.gridState.map((row) => row[j]);
        const transformedColumn = transformFn(column);

        transformedColumn.forEach((value, i) => (this.gridState[i][j] = value));
      }
    } else {
      this.gridState = this.gridState.map((row) => transformFn(row));
    }

    if (this.hasGridChanged(previousState)) {
      this.addRandomTile();
      this.checkGameStatus();
    }
  }

  shiftAndMerge(line) {
    const nonZeroTiles = line.filter((tile) => tile !== 0);

    for (let i = 0; i < nonZeroTiles.length - 1; i++) {
      if (nonZeroTiles[i] === nonZeroTiles[i + 1]) {
        nonZeroTiles[i] *= 2;
        this.score += nonZeroTiles[i];

        if (nonZeroTiles[i] === 2048) {
          this.gameStatus.isWon = true;
        }

        nonZeroTiles.splice(i + 1, 1);
      }
    }

    while (nonZeroTiles.length < this.gridSize) {
      nonZeroTiles.push(0);
    }

    return nonZeroTiles;
  }

  hasGridChanged(previousGrid) {
    for (let i = 0; i < previousGrid.length; i++) {
      for (let j = 0; j < previousGrid[i].length; j++) {
        if (previousGrid[i][j] !== this.gridState[i][j]) {
          return true;
        }
      }
    }

    return false;
  }

  checkGameStatus() {
    if (this.gameStatus.isWon) {
      this.gameStatus.isGameOver = true;

      return;
    }

    let hasMoves = false;

    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        const tile = this.gridState[i][j];

        if (
          tile === 0 ||
          (i < this.gridSize - 1 && tile === this.gridState[i + 1][j]) ||
          (j < this.gridSize - 1 && tile === this.gridState[i][j + 1])
        ) {
          hasMoves = true;
          break;
        }
      }

      if (hasMoves) {
        break;
      }
    }

    if (!hasMoves) {
      this.gameStatus.isGameOver = true;
    }
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        if (this.gridState[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.gridState[row][col] =
        Math.random() * 100 < this.probabilityOfFour ? 4 : 2;
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return structuredClone(this.gridState);
  }

  getStatus() {
    if (!this.gameStatus.isRunning) {
      return 'idle';
    }

    if (this.gameStatus.isWon) {
      return 'win';
    }

    if (this.gameStatus.isGameOver) {
      return 'lose';
    }

    return 'playing';
  }
}

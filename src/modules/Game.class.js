'use strict';

function getLineCoords(direction, lineIndex, pos) {
  if (direction === 'left') {
    return {
      row: lineIndex,
      col: pos,
    };
  }

  if (direction === 'right') {
    return {
      row: lineIndex,
      col: 3 - pos,
    };
  }

  if (direction === 'up') {
    return {
      row: pos,
      col: lineIndex,
    };
  }

  return {
    row: 3 - pos,
    col: lineIndex,
  };
}

class Game {
  constructor(initialState) {
    if (initialState) {
      this.initialState = initialState.map((row) => [...row]);
    } else {
      this.initialState = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }

    this.nextTileId = 1;
    this.state = this.initialState.map((row) => [...row]);
    this.tiles = [];
    this.mergedGhosts = [];
    this.score = 0;
    this.status = 'idle';

    this.initTilesFromState();
  }

  initTilesFromState() {
    this.tiles = [];
    this.mergedGhosts = [];

    for (let rowIndex = 0; rowIndex < 4; rowIndex += 1) {
      for (let colIndex = 0; colIndex < 4; colIndex += 1) {
        const value = this.state[rowIndex][colIndex];

        if (value !== 0) {
          this.tiles.push({
            id: this.nextTileId,
            value,
            row: rowIndex,
            col: colIndex,
            prevRow: null,
            prevCol: null,
            isNew: false,
            isMerged: false,
          });

          this.nextTileId += 1;
        }
      }
    }
  }

  syncStateFromTiles() {
    const nextBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.tiles.forEach((tile) => {
      nextBoard[tile.row][tile.col] = tile.value;
    });

    this.state = nextBoard;
  }

  getState() {
    return this.state.map((row) => [...row]);
  }

  getTiles() {
    return this.tiles.map((tile) => ({ ...tile }));
  }

  getMergedGhosts() {
    return this.mergedGhosts.map((ghost) => ({ ...ghost }));
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  hasTile(target) {
    return this.state.some((row) => row.includes(target));
  }

  canMove() {
    for (let rowIndex = 0; rowIndex < 4; rowIndex += 1) {
      for (let colIndex = 0; colIndex < 4; colIndex += 1) {
        if (this.state[rowIndex][colIndex] === 0) {
          return true;
        }

        if (
          colIndex < 3 &&
          this.state[rowIndex][colIndex] === this.state[rowIndex][colIndex + 1]
        ) {
          return true;
        }

        if (
          rowIndex < 3 &&
          this.state[rowIndex][colIndex] === this.state[rowIndex + 1][colIndex]
        ) {
          return true;
        }
      }
    }

    return false;
  }

  addRandomTile() {
    const emptyCells = [];

    for (let rowIndex = 0; rowIndex < 4; rowIndex += 1) {
      for (let colIndex = 0; colIndex < 4; colIndex += 1) {
        if (this.state[rowIndex][colIndex] === 0) {
          emptyCells.push({
            row: rowIndex,
            col: colIndex,
          });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const targetCell = emptyCells[randomIndex];
    const value = Math.random() < 0.1 ? 4 : 2;

    this.tiles.push({
      id: this.nextTileId,
      value,
      row: targetCell.row,
      col: targetCell.col,
      prevRow: null,
      prevCol: null,
      isNew: true,
      isMerged: false,
    });

    this.nextTileId += 1;
    this.state[targetCell.row][targetCell.col] = value;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';
    this.mergedGhosts = [];

    this.tiles = this.tiles.map((tile) => ({
      ...tile,
      prevRow: null,
      prevCol: null,
      isNew: false,
      isMerged: false,
    }));

    this.addRandomTile();
    this.addRandomTile();

    if (this.hasTile(2048)) {
      this.status = 'win';
    } else if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
    this.initTilesFromState();
  }

  makeMove(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const tileGrid = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];

    this.tiles.forEach((tile) => {
      tileGrid[tile.row][tile.col] = tile;
    });

    const nextTiles = [];
    const nextGhosts = [];
    let totalScore = 0;
    let hasMoved = false;

    for (let lineIndex = 0; lineIndex < 4; lineIndex += 1) {
      const lineTiles = [];

      for (let pos = 0; pos < 4; pos += 1) {
        const coords = getLineCoords(direction, lineIndex, pos);
        const currentTile = tileGrid[coords.row][coords.col];

        if (currentTile) {
          lineTiles.push(currentTile);
        }
      }

      let index = 0;
      let targetPos = 0;

      while (index < lineTiles.length) {
        const targetCoords = getLineCoords(direction, lineIndex, targetPos);
        const firstTile = lineTiles[index];
        const secondTile = lineTiles[index + 1];

        if (secondTile && firstTile.value === secondTile.value) {
          const mergedValue = firstTile.value * 2;

          totalScore += mergedValue;
          hasMoved = true;

          nextGhosts.push({
            value: firstTile.value,
            row: targetCoords.row,
            col: targetCoords.col,
            prevRow: firstTile.row,
            prevCol: firstTile.col,
          });

          nextGhosts.push({
            value: secondTile.value,
            row: targetCoords.row,
            col: targetCoords.col,
            prevRow: secondTile.row,
            prevCol: secondTile.col,
          });

          nextTiles.push({
            id: this.nextTileId,
            value: mergedValue,
            row: targetCoords.row,
            col: targetCoords.col,
            prevRow: null,
            prevCol: null,
            isNew: false,
            isMerged: true,
          });

          this.nextTileId += 1;
          index += 2;
        } else {
          if (
            firstTile.row !== targetCoords.row ||
            firstTile.col !== targetCoords.col
          ) {
            hasMoved = true;
          }

          nextTiles.push({
            id: firstTile.id,
            value: firstTile.value,
            row: targetCoords.row,
            col: targetCoords.col,
            prevRow: firstTile.row,
            prevCol: firstTile.col,
            isNew: false,
            isMerged: false,
          });

          index += 1;
        }

        targetPos += 1;
      }
    }

    if (!hasMoved) {
      return;
    }

    this.tiles = nextTiles;
    this.mergedGhosts = nextGhosts;
    this.syncStateFromTiles();
    this.score += totalScore;
    this.addRandomTile();

    if (this.hasTile(2048)) {
      this.status = 'win';
    } else if (!this.canMove()) {
      this.status = 'lose';
    }
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
}

module.exports = Game;

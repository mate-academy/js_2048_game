'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */

class Game {
  static Status = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  };

  initialState = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  constructor() {
    this.currentState = this.initialState.map((row) => [...row]);
    this.status = Game.Status.idle;
    this.score = 0;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.currentState;
  }

  getStatus() {
    this.updateStatus();

    return this.status;
  }

  start() {
    this.status = Game.Status.playing;
    this.currentState = this.makeDeepCopyState(this.initialState);
    this.createRandomTile();
    this.createRandomTile();
    this.showTiles();
  }

  restart() {
    this.clearTheBoard();
    this.showTiles();
    this.status = Game.Status.idle;
    this.score = 0;
  }

  moveUp() {
    if (this.status !== Game.Status.playing) {
      return;
    }

    let didTilesMove = false;

    for (let column = 0; column < 4; column++) {
      const columnData = this.currentState.map((row) => row[column]);
      const { newLine, moved } = this.processColumn(columnData);

      if (moved) {
        didTilesMove = true;
      }

      for (let row = 0; row < 4; row++) {
        this.currentState[row][column] = newLine[row];
      }
    }

    if (didTilesMove) {
      this.createRandomTile();
    }

    return didTilesMove;
  }

  moveDown() {
    if (this.status !== Game.Status.playing) {
      return;
    }

    let didTilesMove = false;

    for (let column = 0; column < 4; column++) {
      const columnData = this.currentState.map((row) => row[column]);
      const reversedColumn = columnData.reverse();
      const { newLine, moved } = this.processColumn(reversedColumn);

      if (moved) {
        didTilesMove = true;
      }

      const correctedColumn = newLine.reverse();

      for (let row = 0; row < 4; row++) {
        this.currentState[row][column] = correctedColumn[row];
      }
    }

    if (didTilesMove) {
      this.createRandomTile();
    }

    return didTilesMove;
  }

  moveLeft() {
    if (this.status !== Game.Status.playing) {
      return;
    }

    let didTilesMove = false;

    for (let row = 0; row < 4; row++) {
      const rowData = this.currentState[row];
      const { newLine, moved } = this.processColumn(rowData);

      if (moved) {
        didTilesMove = true;
      }

      this.currentState[row] = newLine;
    }

    if (didTilesMove) {
      this.createRandomTile();
    }

    return didTilesMove;
  }

  moveRight() {
    if (this.status !== Game.Status.playing) {
      return;
    }

    let didTilesMove = false;

    for (let row = 0; row < 4; row++) {
      const rowData = this.currentState[row];
      const reversedRow = rowData.reverse();
      const { newLine, moved } = this.processColumn(reversedRow);

      if (moved) {
        didTilesMove = true;
      }

      const correctedRow = newLine.reverse();

      this.currentState[row] = correctedRow;
    }

    if (didTilesMove) {
      this.createRandomTile();
    }

    return didTilesMove;
  }

  processColumn(line) {
    const newLine = [0, 0, 0, 0];
    let mergeOccurred = false;
    let position = 0;
    let scoreIncrease = 0;

    for (let i = 0; i < line.length; i++) {
      if (line[i] === 0) {
        continue;
      }

      if (!mergeOccurred && position > 0 && newLine[position - 1] === line[i]) {
        newLine[position - 1] *= 2;
        scoreIncrease += newLine[position - 1];
        mergeOccurred = true;
      } else {
        newLine[position] = line[i];
        position++;
        mergeOccurred = false;
      }
    }

    const moved = !this.areLinesEqual(line, newLine);

    this.score += scoreIncrease;

    return { newLine, moved };
  }

  getColumn(index) {
    return this.currentState.map((row) => row[index]);
  }

  setColumn(index, column) {
    for (let row = 0; row < 4; row++) {
      this.currentState[row][index] = column[row];
    }
  }

  areLinesEqual(line1, line2) {
    return line1.every((value, index) => value === line2[index]);
  }

  makeDeepCopyState(stateForCopy) {
    return stateForCopy.map((row) => [...row]);
  }

  createRandomTile() {
    const randomTile = this.randomNumber();

    if (!randomTile) {
      return;
    }

    const [row, column] = randomTile;

    this.currentState[row][column] = this.generateTileValue();
    this.showTiles();
  }

  randomNumber() {
    const randomRange = this.getRequiredTiles(0);

    if (randomRange.length === 0) {
      return null;
    }

    const randomNumber = Math.floor(Math.random() * randomRange.length);

    return randomRange[randomNumber];
  }

  getRequiredTiles(requiredValue) {
    const requiredTiles = [];

    for (let row = 0; row < this.currentState.length; row++) {
      for (let cell = 0; cell < this.currentState[row].length; cell++) {
        if (this.currentState[row][cell] === requiredValue) {
          requiredTiles.push([row, cell]);
        }
      }
    }

    return requiredTiles;
  }

  generateTileValue() {
    const randomValue = Math.random();

    return randomValue > 0.9 ? 4 : 2;
  }

  updateStatus() {
    if (this.didPlayerWin()) {
      this.status = Game.Status.win;
    } else if (this.didPlayerLose()) {
      this.status = Game.Status.lose;
    }
  }

  didPlayerWin() {
    return this.getRequiredTiles(2048).length > 0;
  }

  didPlayerLose() {
    if (this.getRequiredTiles(0).length > 0) {
      return false;
    }

    if (!this.checkEqualNeighbors()) {
      return false;
    }

    return true;
  }

  checkEqualNeighbors() {
    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (
          column < 3 &&
          this.currentState[row][column] === this.currentState[row][column + 1]
        ) {
          return false;
        }

        if (
          row < 3 &&
          this.currentState[row][column] === this.currentState[row + 1][column]
        ) {
          return false;
        }
      }
    }

    return true;
  }

  showTiles() {
    const tiles = document.getElementsByClassName('field-cell');

    let fieldCounter = 0;

    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        const tileValue = this.currentState[row][column];

        if (tileValue === 0) {
          tiles[fieldCounter].innerText = '';
          tiles[fieldCounter].className = `field-cell`;
        } else {
          tiles[fieldCounter].innerText = tileValue;
          tiles[fieldCounter].className = `field-cell field-cell--${tileValue}`;
        }

        fieldCounter++;
      }
    }
  }

  clearTheBoard() {
    this.currentState = this.makeDeepCopyState(this.initialState);
  }
}

module.exports = Game;

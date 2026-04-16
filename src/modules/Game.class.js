'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  constructor(initialState) {
    const clearBoard = Array.from({ length: 4 }, () => Array(4).fill(0));

    const board = initialState || clearBoard;

    this.initialState = this.copyBoard(board);
    this.state = this.copyBoard(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  getState() {
    return this.copyBoard(this.state);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  moveLeft() {
    this.moveLines(
      (index) => this.getRow(index),
      (index, line) => this.setRow(index, line),
      (line) => this.moveRowLeft(line),
    );
  }

  moveRight() {
    this.moveLines(
      (index) => this.getRow(index),
      (index, line) => this.setRow(index, line),
      (line) => this.moveRowRight(line),
    );
  }

  moveUp() {
    this.moveLines(
      (index) => this.getColumn(index),
      (index, line) => this.setColumn(index, line),
      (line) => this.moveRowLeft(line),
    );
  }

  moveDown() {
    this.moveLines(
      (index) => this.getColumn(index),
      (index, line) => this.setColumn(index, line),
      (line) => this.moveRowRight(line),
    );
  }

  start() {
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.state = this.copyBoard(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  addRandomTile() {
    const state = this.state;
    const emptyTiles = [];

    for (let i = 0; i < state.length; i++) {
      for (let j = 0; j < state[i].length; j++) {
        if (state[i][j] === 0) {
          emptyTiles.push([i, j]);
        }
      }
    }

    if (emptyTiles.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * emptyTiles.length);
    const [rowIndex, colIndex] = emptyTiles[randomIndex];

    state[rowIndex][colIndex] = Math.random() < 0.1 ? 4 : 2;
  }

  moveRowLeft(row) {
    const numbers = row.filter((cell) => cell !== 0);
    const newRow = [];
    let score = 0;

    for (let j = 0; j < numbers.length; j++) {
      if (numbers[j] === numbers[j + 1]) {
        newRow.push(numbers[j] + numbers[j + 1]);
        score += numbers[j] + numbers[j + 1];

        j++;
      } else {
        newRow.push(numbers[j]);
      }
    }

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return [newRow, score];
  }

  moveRowRight(row) {
    const reversedRow = [...row].reverse();
    const [reversedNewRow, score] = this.moveRowLeft(reversedRow);

    return [reversedNewRow.reverse(), score];
  }

  hasBoardChanged(prevState) {
    let hasChanged = false;

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (prevState[i][j] !== this.state[i][j]) {
          hasChanged = true;
          break;
        }
      }

      if (hasChanged) {
        break;
      }
    }

    return hasChanged;
  }

  hasAvailableMoves() {
    const state = this.state;

    for (let i = 0; i < state.length; i++) {
      for (let j = 0; j < state[i].length; j++) {
        const current = state[i][j];

        if (current === 0) {
          return true;
        }

        if (j + 1 < state[i].length && current === state[i][j + 1]) {
          return true;
        }

        if (i + 1 < state.length && current === state[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }

  updateStatus() {
    const state = this.state;

    for (let i = 0; i < state.length; i++) {
      for (let j = 0; j < state[i].length; j++) {
        if (state[i][j] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    if (!this.hasAvailableMoves()) {
      this.status = 'lose';

      return;
    }

    this.status = 'playing';
  }

  copyBoard(board) {
    return board.map((row) => [...row]);
  }

  moveLines(getLine, setLine, moveLine) {
    if (this.status !== 'playing') {
      return;
    }

    let scoreToAdd = 0;
    const previousState = this.copyBoard(this.state);

    for (let i = 0; i < this.state.length; i++) {
      const line = getLine(i);
      const [newLine, score] = moveLine(line);

      setLine(i, newLine);
      scoreToAdd += score;
    }

    const hasChanged = this.hasBoardChanged(previousState);

    if (hasChanged) {
      this.score += scoreToAdd;
      this.addRandomTile();
      this.updateStatus();
    }
  }

  getRow(index) {
    return this.state[index];
  }

  setRow(index, row) {
    this.state[index] = row;
  }

  getColumn(index) {
    const column = [];

    for (let row = 0; row < this.state.length; row++) {
      column.push(this.state[row][index]);
    }

    return column;
  }

  setColumn(index, column) {
    for (let row = 0; row < this.state.length; row++) {
      this.state[row][index] = column[row];
    }
  }
}

module.exports = Game;

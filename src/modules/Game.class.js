'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
const cloneBoard = (board) => board.map((row) => row.slice());

class Game {
  constructor(initialState) {
    if (initialState) {
      this.board = initialState;

      this.initialState = cloneBoard(this.board);
    } else {
      this.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];

      this.initialState = cloneBoard(this.board);
    }

    this.st = 'idle';
    this.score = 0;
  }

  getState() {
    return cloneBoard(this.board);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.st;
  }

  findEmptyCells() {
    const allCells = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 0) {
          allCells.push([i, j]);
        }
      }
    }

    return allCells;
  }

  spawnRandomTile() {
    const emptyCells = this.findEmptyCells();

    if (emptyCells.length === 0) {
    } else {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const randomCell = emptyCells[randomIndex];

      const randomNumber = Math.random();
      let value;

      if (randomNumber <= 0.1) {
        value = 4;
      } else {
        value = 2;
      }

      this.board[randomCell[0]][randomCell[1]] = value;
    }
  }

  start() {
    this.board = cloneBoard(this.initialState);
    this.spawnRandomTile();
    this.spawnRandomTile();

    this.st = 'playing';
    this.score = 0;
  }

  restart() {
    this.board = cloneBoard(this.initialState);
    this.st = 'idle';
    this.score = 0;
  }

  makeNewLine(line) {
    const noEmptyCellsLine = line.filter((el) => el !== 0);
    let gainedScore = 0;
    const newLine = [];

    for (let i = 0; i < noEmptyCellsLine.length; i++) {
      if (noEmptyCellsLine[i] === noEmptyCellsLine[i + 1]) {
        const newValue = noEmptyCellsLine[i] * 2;

        newLine.push(newValue);
        gainedScore += newValue;
        i++;
      } else {
        newLine.push(noEmptyCellsLine[i]);
      }
    }

    while (newLine.length < line.length) {
      newLine.push(0);
    }

    let changed = false;

    for (let i = 0; i < newLine.length; i++) {
      if (newLine[i] !== line[i]) {
        changed = true;
        break;
      }
    }

    return {
      newLine,
      gainedScore,
      changed,
    };
  }

  moveLeft() {
    if (this.st !== 'playing') {
      return;
    }

    let totalGainedScore = 0;
    let anyChanged = false;

    for (let i = 0; i < this.board.length; i++) {
      const line = this.board[i];
      const { newLine, gainedScore, changed } = this.makeNewLine(line);

      this.board[i] = newLine;
      totalGainedScore += gainedScore;

      if (changed) {
        anyChanged = true;
      }
    }

    this.score += totalGainedScore;

    if (anyChanged) {
      this.spawnRandomTile();
      this.win();

      if (this.st !== 'win') {
        const result = this.possibleMoves();

        if (!result) {
          this.st = 'lose';
        }
      }
    }
  }

  moveRight() {
    if (this.st !== 'playing') {
      return;
    }

    let totalGainedScore = 0;
    let anyChanged = false;

    for (let i = 0; i < this.board.length; i++) {
      const line = this.board[i];
      const reversedLine = [...line].reverse();

      const { newLine, gainedScore, changed } = this.makeNewLine(reversedLine);

      const reversedNewLine = [...newLine].reverse();

      this.board[i] = reversedNewLine;
      totalGainedScore += gainedScore;

      if (changed) {
        anyChanged = true;
      }
    }

    this.score += totalGainedScore;

    if (anyChanged) {
      this.spawnRandomTile();
      this.win();

      if (this.st !== 'win') {
        const result = this.possibleMoves();

        if (!result) {
          this.st = 'lose';
        }
      }
    }
  }

  moveUp() {
    if (this.st !== 'playing') {
      return;
    }

    let totalGainedScore = 0;
    let anyChanged = false;

    for (let col = 0; col < this.board.length; col++) {
      const column = [];

      for (let i = 0; i < this.board.length; i++) {
        column.push(this.board[i][col]);
      }

      const { newLine, gainedScore, changed } = this.makeNewLine(column);

      for (let i = 0; i < this.board.length; i++) {
        this.board[i][col] = newLine[i];
      }

      totalGainedScore += gainedScore;

      if (changed) {
        anyChanged = true;
      }
    }

    this.score += totalGainedScore;

    if (anyChanged) {
      this.spawnRandomTile();
      this.win();

      if (this.st !== 'win') {
        const result = this.possibleMoves();

        if (!result) {
          this.st = 'lose';
        }
      }
    }
  }

  moveDown() {
    if (this.st !== 'playing') {
      return;
    }

    let totalGainedScore = 0;
    let anyChanged = false;

    for (let col = 0; col < this.board.length; col++) {
      const column = [];

      for (let i = 0; i < this.board.length; i++) {
        column.push(this.board[i][col]);
      }

      const revColumn = [...column].reverse();

      const { newLine, gainedScore, changed } = this.makeNewLine(revColumn);

      const reversedNewLine = [...newLine].reverse();

      for (let i = 0; i < this.board.length; i++) {
        this.board[i][col] = reversedNewLine[i];
      }

      totalGainedScore += gainedScore;

      if (changed) {
        anyChanged = true;
      }
    }

    this.score += totalGainedScore;

    if (anyChanged) {
      this.spawnRandomTile();
      this.win();

      if (this.st !== 'win') {
        const result = this.possibleMoves();

        if (!result) {
          this.st = 'lose';
        }
      }
    }
  }

  win() {
    for (let i = 0; i < this.board.length; i++) {
      const found = this.board[i].some((cell) => cell === 2048);

      if (found) {
        this.st = 'win';
        break;
      }
    }
  }

  possibleMoves() {
    for (let i = 0; i < this.board.length; i++) {
      const found = this.board[i].some((cell) => cell === 0);

      if (found) {
        return true;
      }
    }

    for (let row = 0; row < this.board.length; row++) {
      for (let i = 0; i < this.board[row].length - 1; i++) {
        if (this.board[row][i] === this.board[row][i + 1]) {
          return true;
        }
      }
    }

    for (let col = 0; col < this.board.length; col++) {
      for (let i = 0; i < this.board[col].length - 1; i++) {
        if (this.board[i][col] === this.board[i + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;

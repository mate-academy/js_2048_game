/* eslint-disable function-paren-newline */
'use strict';

/**
 * Classe que representa o jogo 2048.
 */
class Game {
  constructor(initialState) {
    const defaultBoard = Array.from({ length: 4 }, () =>
      Array.from({ length: 4 }, () => 0),
    );

    this.initialState = JSON.parse(
      JSON.stringify(initialState !== undefined ? initialState : defaultBoard),
    );

    this.state = JSON.parse(JSON.stringify(this.initialState));
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let changed = false;
    let gainedScore = 0;

    this.state.forEach((row, rowIndex, board) => {
      const { newLine, mergedScore } = this.mergeLine(row);

      gainedScore += mergedScore;

      while (newLine.length < 4) {
        newLine.push(0);
      }

      for (let i = 0; i < 4; i++) {
        if (board[rowIndex][i] !== newLine[i]) {
          changed = true;
          break;
        }
      }

      board[rowIndex] = newLine;
    });

    if (changed) {
      this.score += gainedScore;
      this.addRandomTile();
    }

    this.updateStatus();
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let changed = false;
    let gainedScore = 0;

    this.state.forEach((row, rowIndex, board) => {
      const reversedRow = [...row].reverse();
      const { newLine, mergedScore } = this.mergeLine(reversedRow);

      gainedScore += mergedScore;

      while (newLine.length < 4) {
        newLine.push(0);
      }

      const reversedLine = newLine.reverse();

      for (let i = 0; i < 4; i++) {
        if (board[rowIndex][i] !== reversedLine[i]) {
          changed = true;
          break;
        }
      }

      board[rowIndex] = reversedLine;
    });

    if (changed) {
      this.score += gainedScore;
      this.addRandomTile();
    }

    this.updateStatus();
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let changed = false;
    let gainedScore = 0;

    for (let col = 0; col < 4; col++) {
      const column = this.state.map((row) => row[col]);
      const { newLine, mergedScore } = this.mergeLine(column);

      gainedScore += mergedScore;

      while (newLine.length < 4) {
        newLine.push(0);
      }

      for (let row = 0; row < 4; row++) {
        if (this.state[row][col] !== newLine[row]) {
          changed = true;
          break;
        }
      }

      for (let row = 0; row < 4; row++) {
        this.state[row][col] = newLine[row];
      }
    }

    if (changed) {
      this.score += gainedScore;
      this.addRandomTile();
    }

    this.updateStatus();
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let changed = false;
    let gainedScore = 0;

    for (let col = 0; col < 4; col++) {
      const column = this.state.map((row) => row[col]);
      const reversedCol = [...column].reverse();
      const { newLine, mergedScore } = this.mergeLine(reversedCol);

      gainedScore += mergedScore;

      while (newLine.length < 4) {
        newLine.push(0);
      }

      const reversedLine = newLine.reverse();

      for (let row = 0; row < 4; row++) {
        if (this.state[row][col] !== reversedLine[row]) {
          changed = true;
          break;
        }
      }

      for (let row = 0; row < 4; row++) {
        this.state[row][col] = reversedLine[row];
      }
    }

    if (changed) {
      this.score += gainedScore;
      this.addRandomTile();
    }

    this.updateStatus();
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
    const isBoardEmpty = this.state.flat().every((cell) => cell === 0);

    this.status = 'playing';
    this.score = 0;

    if (isBoardEmpty) {
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  restart() {
    this.state = JSON.parse(JSON.stringify(this.initialState));
    this.score = 0;
    this.status = 'idle';
  }

  addRandomTile() {
    const emptyCells = [];

    this.state.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyCells.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];
    const randomNumber = Math.random() < 0.9 ? 2 : 4;

    this.state[randomCell.row][randomCell.col] = randomNumber;
  }

  mergeLine(arr) {
    const nonZeroArr = arr.filter((n) => n > 0);
    const result = [];
    let mergedScore = 0;

    for (let i = 0; i < nonZeroArr.length; i++) {
      if (nonZeroArr[i] === nonZeroArr[i + 1]) {
        const merged = nonZeroArr[i] * 2;

        result.push(merged);
        mergedScore += merged;
        i++;
      } else {
        result.push(nonZeroArr[i]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return { newLine: result, mergedScore };
  }

  updateStatus() {
    for (const row of this.state) {
      if (row.includes(2048)) {
        this.status = 'win';

        return;
      }
    }

    const canMove = this.state.some((row, i) =>
      row.some((cell, j) => {
        if (cell === 0) {
          return true;
        }

        if (j < 3 && cell === row[j + 1]) {
          return true;
        }

        if (i < 3 && cell === this.state[i + 1][j]) {
          return true;
        }

        return false;
      }),
    );

    if (!canMove) {
      this.status = 'lose';

      return;
    }

    this.status = 'playing';
  }
}

export default Game;
export { Game };

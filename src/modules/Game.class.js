'use strict';

class Game {
  constructor(initialState) {
    const initial =
      initialState || Array.from({ length: 4 }, () => [0, 0, 0, 0]);

    this.state = initial.map((row) => [...row]);
    this.initialState = initial.map((row) => [...row]);

    this.score = 0;
    this.status = 'idle';
  }

  getState() {
    return this.state;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();

    return this.status;
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';

    return this.state;
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = this.state.map((row) => [...row]);

    this.state = this.state.map((row) => {
      const { row: movedRow, score } = moveRow(row);

      this.score += score;

      return movedRow;
    });

    if (this.isChanged(oldState)) {
      this.addRandomTile();
    }

    this.checkWin();
    this.canMove();
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = this.state.map((row) => [...row]);

    this.state = this.state.map((row) => {
      const reversedRow = [...row].reverse();

      const { row: movedRow, score } = moveRow(reversedRow);

      this.score += score;

      return movedRow.reverse();
    });

    if (this.isChanged(oldState)) {
      this.addRandomTile();
    }

    this.checkWin();
    this.canMove();
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = this.state.map((row) => [...row]);

    for (let column = 0; column < 4; column++) {
      const currentColumn = this.state.map((row) => row[column]);

      const { row: movedColumn, score } = moveRow(currentColumn);

      this.score += score;

      for (let row = 0; row < 4; row++) {
        this.state[row][column] = movedColumn[row];
      }
    }

    if (this.isChanged(oldState)) {
      this.addRandomTile();
    }

    this.checkWin();
    this.canMove();
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = this.state.map((row) => [...row]);

    for (let column = 0; column < 4; column++) {
      const currentColumn = this.state.map((row) => row[column]);

      const reversedColumn = [...currentColumn].reverse();

      const { row: movedColumn, score } = moveRow(reversedColumn);

      this.score += score;

      const resultColumn = movedColumn.reverse();

      for (let row = 0; row < 4; row++) {
        this.state[row][column] = resultColumn[row];
      }
    }

    if (this.isChanged(oldState)) {
      this.addRandomTile();
    }

    this.checkWin();
    this.canMove();
  }

  isChanged(oldState) {
    return oldState.some((row, rowIndex) => {
      return row.some((cell, columnIndex) => {
        return cell !== this.state[rowIndex][columnIndex];
      });
    });
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (this.state[row][column] === 0) {
          emptyCells.push([row, column]);
        }
      }
    }

    return emptyCells;
  }

  addRandomTile() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    const randomCell = emptyCells[randomIndex];

    const randomValue = Math.floor(Math.random() * 100);

    if (randomValue < 90) {
      this.state[randomCell[0]][randomCell[1]] = 2;
    } else {
      this.state[randomCell[0]][randomCell[1]] = 4;
    }
  }

  canMove() {
    if (this.status === 'win') {
      return false;
    }

    const emptyCells = this.getEmptyCells();

    for (let row = 0; row < this.state.length; row++) {
      const currentRow = this.state[row];

      const hasPair = currentRow.some((elem, index) => {
        return elem === currentRow[index + 1];
      });

      if (hasPair === true) {
        return true;
      }
    }

    for (let row = 0; row < this.state.length - 1; row++) {
      for (let column = 0; column < this.state[row].length; column++) {
        if (this.state[row][column] === this.state[row + 1][column]) {
          return true;
        }
      }
    }

    if (emptyCells.length === 0) {
      this.status = 'lose';
    } else {
      return true;
    }

    return false;
  }

  checkWin() {
    const has2048 = this.state.some((row) => {
      return row.some((elem) => elem >= 2048);
    });

    if (has2048) {
      this.status = 'win';
    }
  }
}

function moveRow(row) {
  const filteredRow = row.filter((item) => item > 0);

  const { row: mergedRow, score } = mergeRow(filteredRow);

  while (mergedRow.length < 4) {
    mergedRow.push(0);
  }

  return {
    row: mergedRow,
    score,
  };
}

function mergeRow(row) {
  let score = 0;

  for (let i = 0; i < row.length; i++) {
    if (row[i] === row[i + 1]) {
      row[i] += row[i + 1];
      score += row[i];
      i++;
      row.splice(i, 1);
    }
  }

  return {
    row,
    score,
  };
}

export default Game;

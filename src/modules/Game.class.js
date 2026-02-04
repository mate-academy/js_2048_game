'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  constructor(initialState) {
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'idle';
  }
  // #region addRandomCell
  addRandomCell() {
    const clearBoard = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 0) {
          clearBoard.push([i, j]);
        }
      }
    }

    if (clearBoard.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * clearBoard.length);
    const randomCell = clearBoard[randomIndex];
    const randomValue = Math.random() > 0.1 ? 2 : 4;

    this.board[randomCell[0]][randomCell[1]] = randomValue;
  }
  // #endregion
  // #region moveMethods
  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let move = false;

    for (let i = 0; i < this.board.length; i++) {
      const oldRow = [...this.board[i]];
      const newRow = [];

      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] !== 0) {
          newRow.push(this.board[i][j]);
        }
      }

      for (let v = 0; v < newRow.length; v++) {
        if (newRow[v] === newRow[v + 1]) {
          const newValue = newRow[v] * 2;

          newRow.splice(v + 1, 1);
          newRow[v] = newValue;
          this.score += newValue;

          if (newValue === 2048) {
            this.status = 'win';
          }

          v++;
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
      }

      for (let index = 0; index < oldRow.length; index++) {
        if (oldRow[index] !== newRow[index]) {
          move = true;

          break;
        }
      }

      this.board[i] = newRow;
    }

    if (move === true) {
      this.addRandomCell();
    }

    if (this.status === 'playing') {
      this.ifLose();
    }
  }

  moveRight() {
    for (let i = 0; i < this.board.length; i++) {
      this.board[i].reverse();
    }

    this.moveLeft();

    for (let i = 0; i < this.board.length; i++) {
      this.board[i].reverse();
    }
  }

  transposeBoard() {
    const newBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        newBoard[j][i] = this.board[i][j];
      }
    }

    this.board = newBoard;
  }

  moveUp() {
    this.transposeBoard();
    this.moveLeft();
    this.transposeBoard();
  }

  moveDown() {
    this.transposeBoard();

    for (let i = 0; i < this.board.length; i++) {
      this.board[i].reverse();
    }

    this.moveLeft();

    for (let i = 0; i < this.board.length; i++) {
      this.board[i].reverse();
    }

    this.transposeBoard();
  }

  // #endregion

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }
    this.status = 'playing';

    this.addRandomCell();
    this.addRandomCell();
  }

  ifLose() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 0) {
          return;
        }

        if (j < 3) {
          if (this.board[i][j] === this.board[i][j + 1]) {
            return;
          }
        }

        if (i < 3) {
          if (this.board[i][j] === this.board[i + 1][j]) {
            return;
          }
        }
      }
    }
    this.status = 'lose';
  }

  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
  }
}

export default Game;

'use strict';

class Game {
  constructor(initialState = null) {
    if (initialState) {
      this.board = initialState;
    } else {
      this.board = Array.from({ length: 4 }, () => Array(4).fill(2));
    }

    this.status = 'idle';
    this.score = 0;
  }

  moveLeft() {
    for (let row = 0; row < this.board.length; row++) {
      const notEmptyCellsHo = [];

      for (let col = 0; col < this.board.length; col++) {
        if (this.board[row][col] !== 0) {
          notEmptyCellsHo.push(this.board[row][col]);
        }
      }

      for (let i = 0; i < notEmptyCellsHo.length; i++) {
        if (notEmptyCellsHo[i] === notEmptyCellsHo[i + 1]) {
          const result = notEmptyCellsHo[i] * 2;

          notEmptyCellsHo[i] = result;
          notEmptyCellsHo.splice(i + 1, 1);
        }
      }

      for (let k = notEmptyCellsHo.length; k < 4; k++) {
        notEmptyCellsHo[k] = 0;
      }

      for (let col = 0; col < this.board[row].length; col++) {
        this.board[row][col] = notEmptyCellsHo[col];
      }
    }
  }

  moveRight() {
    this.moveLeft();

    for (let row = 0; row < this.board.length; row++) {
      this.board[row].reverse();
    }
  }

  moveUp() {
    for (let col = 0; col < this.board.length; col++) {
      const notEmptyCellsVer = [];

      for (let row = 0; row < this.board.length; row++) {
        if (this.board[row][col] !== 0) {
          notEmptyCellsVer.push(this.board[row][col]);
        }
      }

      for (let i = 0; i < notEmptyCellsVer.length - 1; i++) {
        if (notEmptyCellsVer[i] === notEmptyCellsVer[i + 1]) {
          const result = notEmptyCellsVer[i] * 2;

          notEmptyCellsVer[i] = result;
          notEmptyCellsVer.splice(i + 1, 1);
        }
      }

      for (let k = notEmptyCellsVer.length; k < 4; k++) {
        notEmptyCellsVer[k] = 0;
      }

      for (let row = 0; row < this.board.length; row++) {
        this.board[row][col] = notEmptyCellsVer[row];
      }
    }
  }

  moveDown() {
    for (let col = 0; col < this.board.length; col++) {
      const notEmptyCellsVer = [];
  
      // Собираем все непустые клетки в столбце
      for (let row = 0; row < this.board.length; row++) {
        if (this.board[row][col] !== 0) {
          notEmptyCellsVer.push(this.board[row][col]);
        }
      }
  
      // Объединяем одинаковые числа
      for (let i = notEmptyCellsVer.length - 1; i > 0; i--) {
        if (notEmptyCellsVer[i] === notEmptyCellsVer[i - 1]) {
          notEmptyCellsVer[i] *= 2;
          notEmptyCellsVer[i - 1] = 0;
        }
      }
  
      const mergedCells = notEmptyCellsVer.filter(cell => cell !== 0);
  
      let insertIndex = this.board.length - 1;
      for (let i = mergedCells.length - 1; i >= 0; i--) {
        this.board[insertIndex][col] = mergedCells[i];
        insertIndex--;
      }
  
      for (let row = insertIndex; row >= 0; row--) {
        this.board[row][col] = 0;
      }
    }
  }
  
  

  getScore() {
    return this.score;
  }
  getState() {
    return this.board;
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

  start() {
    let i = 0;

    while (i <= 1) {
      this.addRandomTile();
      i++;
    }
  }

  restart() {
    this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  addRandomTile() {
    const emptyCells = [[]];

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board.length; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const [randomRow, randomCol] = emptyCells[randomIndex];

      this.board[randomRow][randomCol] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  function  render(boardState) {
    const cells = document.querySelectorAll('field-cell');

    
  }
}

module.exports = Game;

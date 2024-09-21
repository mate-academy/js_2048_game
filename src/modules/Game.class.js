'use strict';

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
  constructor(initialState) {
    // eslint-disable-next-line no-console
    console.log(initialState);

    this.initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.startButton = document.querySelector('.button');
    this.board = [];
  }

  moveLeft () {
    const initBoard = JSON.stringify(this.board);
    this.moveCellLeft ();
    // this.cellLeftMerge ();
    // this.moveCellLeft ();
    if (JSON.stringify(this.board) !== initBoard) {
      this.addRandomCell ();
    }
    this.displayBoard();
  }

  moveRight () {
    const initBoard = JSON.stringify(this.board);
    this.moveCellRight ();
    this.cellRightMerge (); 
    this.moveCellRight ();
    if (JSON.stringify(this.board) !== initBoard) {
      this.addRandomCell ();
    }
    this.displayBoard();
  }

  moveUp () {
    const initBoard = JSON.stringify(this.board);
    this.moveCellUp ();
    this.cellUpMerge ();
    this.moveCellUp ();
    if (JSON.stringify(this.board) !== initBoard) {
      this.addRandomCell ();
    }
    this.displayBoard();
  }

  moveDown () {
    const initBoard = JSON.stringify(this.board);
    this.moveCellDown ();
    this.cellDownMerge ();
    this.moveCellDown ();
    if (JSON.stringify(this.board) !== initBoard) {
      this.addRandomCell ();
    }
    this.displayBoard();
  }

  moveCellLeft() {
    for (let i = 0; i < this.board.length; i++) {
      let index = 0;

      for (let j = 1; j < this.board.length; j++){

        if (this.board[i][index] === 0 && this.board[i][j] !== 0){
          [this.board[i][index], this.board[i][j]] = [this.board[i][j], this.board[i][index]];
        }

        if (this.board[i][index] !== 0 && this.board[i][index] === this.board[i][j]){
          this.board[i][index] *= 2;
          this.board[i][j] = 0;
          index++;
        }

      }
    }
  }


  // moveCellLeft() {
  //   for (let i = 0; i < this.board.length; i++) {
  //     let index = 0; // Индекс для перемещения элементов влево
  
  //     for (let j = 0; j < this.board.length; j++) {
  //       if (this.board[i][j] !== 0) {
  //         // Если текущая ячейка не пустая
  //         if (index !== j) {
  //           this.board[i][index] = this.board[i][j]; // Перемещаем элемент
  //           this.board[i][j] = 0; // Очищаем старую позицию
  //         }
  //         index++;
  //       }
  //     }
  
  //     // После перемещения всех элементов проверяем слияния
  //     for (let j = 0; j < this.board.length - 1; j++) {
  //       if (this.board[i][j] !== 0 && this.board[i][j] === this.board[i][j + 1]) {
  //         this.board[i][j] *= 2; // Удваиваем значение
  //         this.board[i][j + 1] = 0; // Очищаем ячейку справа
  //       }
  //     }
  
  //     // Повторно сдвигаем элементы влево после слияний
  //     index = 0;
  //     for (let j = 0; j < this.board.length; j++) {
  //       if (this.board[i][j] !== 0) {
  //         if (index !== j) {
  //           this.board[i][index] = this.board[i][j];
  //           this.board[i][j] = 0;
  //         }
  //         index++;
  //       }
  //     }
  //   }
  // }


  moveCellRight() {
    for (let i = 0; i < this.board.length; i++) {
      let index = this.board.length - 1;

      for (let j = this.board.length - 1; j >= 0; j--) {
        if (this.board[i][j] !== 0) {
          [this.board[i][index], this.board[i][j]] = [this.board[i][j], this.board[i][index]];
          index--;
        }
      }
    }
  }

  moveCellUp() {
    for (let i = 0; i < this.board.length; i++) {
      let index = 0;

      for (let j = 0; j < this.board.length; j++){
        if (this.board[j][i] !== 0){
          [this.board[index][i], this.board[j][i]] = [this.board[j][i], this.board[index][i]];
          index++;
        }
      }
    }
  }

  moveCellDown() {
    for (let i = 0; i < this.board.length; i++) {
      let index = this.board.length - 1;

      for (let j = this.board.length - 1; j >= 0; j--){
        if (this.board[j][i] !== 0){
          [this.board[index][i], this.board[j][i]] = [this.board[j][i], this.board[index][i]];
          index--;
        }
      }
    }
  }

  // cellLeftMerge () {
  //   for (let i = 0; i < this.board.length; i++) {
  //     for (let j = 0; j < this.board.length - 1; j++){
  //       if (this.board[i][j] !== 0 && this.board[i][j] === this.board[i][j + 1]){
  //         this.board[i][j] *= 2;
  //         this.board[i][j + 1] = 0;
  //       }
  //     }
  //   }
  // }

  cellRightMerge () {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = this.board.length - 1; j > 0; j--){
        if (this.board[i][j] !== 0 && this.board[i][j] === this.board[i][j - 1]){
          this.board[i][j] *= 2;
          this.board[i][j - 1] = 0;
        }
      }
    }
  }

  cellUpMerge () {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board.length - 1; j++){
        if (this.board[j][i] !== 0 && this.board[j][i] === this.board[j + 1][i]){
          this.board[j][i] *= 2;
          this.board[j + 1][i] = 0;
        }
      }
    }
  }

  cellDownMerge () {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = this.board.length - 1; j > 0; j--){
        if (this.board[j][i] !== 0 && this.board[j][i] === this.board[j - 1][i]){
          this.board[j][i] *= 2;
          this.board[j - 1][i] = 0;
        }
      }
    }
  }

  /**
   * @returns {number}
   */
  getScore() {}

  /**
   * @returns {number[][]}
   */

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
  getStatus() {}

  start() {
    this.startButton.textContent = 'Restart';
    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.addRandomCell();
    this.addRandomCell();

    this.displayBoard();
  }
  
  restart() {
    this.clearBoard();
    this.start();
  }

  addRandomCell() {
    const emptyCell = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board.length; j++) {
        if (!this.board[i][j]) {
          emptyCell.push({ x: i, y: j });
        }
      }
    }

    if (emptyCell.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCell.length);
      const randomEmptyCell = emptyCell[randomIndex];

      this.board[randomEmptyCell.x][randomEmptyCell.y] =
        Math.random() < 0.9 ? 2 : 4;
    }
  }

  displayBoard() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board.length; j++) {
        const el = this.board[i][j];
        this.cell = document.querySelector(`#cell${i}${j}`);
        if (el > 0) {
          this.cell.textContent = this.board[i][j];
        } else {
          this.cell.textContent = '';
        }
      }
    }
  }

  clearBoard () {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board.length; j++) {
        this.cell = document.querySelector(`#cell${i}${j}`);
        this.cell.textContent = '';
      }
    }
  }
}

module.exports = Game;

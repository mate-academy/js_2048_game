'use strict';

class Game {

  constructor() {
    this.initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.startButton = document.querySelector('.button');
    this.scoreboard = document.querySelector('.game-score');
    this.board = [];
    this.cellHistory = [];
  }

  moveLeft() {
    this.cellHistory = [];
    const initBoard = JSON.stringify(this.board);
    this.moveCellLeft ();
    if (JSON.stringify(this.board) !== initBoard) {
      this.addRandomCell ();
    }
    this.displayGame();
  }

  moveRight() {
    this.cellHistory = [];
    const initBoard = JSON.stringify(this.board);
    this.moveCellRight ();
    if (JSON.stringify(this.board) !== initBoard) {
      this.addRandomCell ();
    }
    this.displayGame();
  }

  moveUp() {
    this.cellHistory = [];
    const initBoard = JSON.stringify(this.board);
    this.moveCellUp ();
    if (JSON.stringify(this.board) !== initBoard) {
      this.addRandomCell ();
    }
    this.displayGame();
  }

  moveDown() {
    this.cellHistory = [];
    const initBoard = JSON.stringify(this.board);
    this.moveCellDown ();
    if (JSON.stringify(this.board) !== initBoard) {
      this.addRandomCell ();
    }
    this.displayGame();
  }

  moveCellLeft() {
    for (let i = 0; i < this.board.length; i++) {
      let index = 0;
  
      for (let j = 0; j < this.board.length; j++) {
        if (this.board[i][j] !== 0) {
          let cellValue = this.board[i][j];
  
          if (index !== j) {
            this.cellHistory.push({
              value: cellValue,
              oldCoords: {
                X: i,
                Y: j,
              },
              newCoords: {
                X: i,
                Y: index,
              },
              move: true,
            });
  
            this.board[i][index] = cellValue;
            this.board[i][j] = 0;
          }
  
          if (index > 0 && this.board[i][index] === this.board[i][index - 1]) {
            let mergeValue = this.board[i][index] * 2;
            const lastMove = this.cellHistory[this.cellHistory.length - 1];

            if (lastMove && lastMove.newCoords.X === i && lastMove.newCoords.Y === index) {
              lastMove.merge = true;
              lastMove.newCoords.Y = index - 1;
            } else {
              this.cellHistory.push({
                value: mergeValue,
                oldCoords: {
                  X: i,
                  Y: index,
                },
                newCoords: {
                  X: i,
                  Y: index - 1,
                },
                merge: true,
              });
            }
            this.board[i][index - 1] = mergeValue;
            this.board[i][index] = 0;
            index--;
          }
          index++;
        }
      }
    }
  }
  
  moveCellRight() {
    for (let i = 0; i < this.board.length; i++) {
      let index = this.board.length - 1;  
  
      for (let j = this.board.length - 1; j >= 0; j--) {
        if (this.board[i][j] !== 0) {
          let cellValue = this.board[i][j];
  
          if (index !== j) {
            this.cellHistory.push({
              value: cellValue,
              oldCoords: {
                X: i,
                Y: j,
              },
              newCoords: {
                X: i,
                Y: index,
              },
              move: true,
            });
  
            this.board[i][index] = cellValue;
            this.board[i][j] = 0;
          }
  
          if (index < this.board.length - 1 && this.board[i][index] === this.board[i][index + 1]) {
            let mergeValue = this.board[i][index] * 2;
  
            const lastMove = this.cellHistory[this.cellHistory.length - 1];
            if (lastMove && lastMove.newCoords.X === i && lastMove.newCoords.Y === index) {
              lastMove.merge = true;
              lastMove.newCoords.Y = index + 1;
            } else {
              this.cellHistory.push({
                value: mergeValue,
                oldCoords: {
                  X: i,
                  Y: index,
                },
                newCoords: {
                  X: i,
                  Y: index + 1,
                },
                merge: true,
              });
            }
  
            this.board[i][index + 1] = mergeValue;
            this.board[i][index] = 0;
            index++;
          }
          index--;
        }
      }
    }
  }
  
  moveCellUp() {
    for (let j = 0; j < this.board.length; j++) {
      let index = 0;
  
      for (let i = 0; i < this.board.length; i++) {
        if (this.board[i][j] !== 0) {
          let cellValue = this.board[i][j];
  
          if (index !== i) {
            this.cellHistory.push({
              value: cellValue,
              oldCoords: {
                X: i,
                Y: j,
              },
              newCoords: {
                X: index,
                Y: j,
              },
              move: true,
            });
            this.board[index][j] = cellValue;
            this.board[i][j] = 0;
          }
  
          if (index > 0 && this.board[index][j] === this.board[index - 1][j]) {
            let mergeValue = this.board[index][j] * 2;
            const lastMove = this.cellHistory[this.cellHistory.length - 1];

            if (lastMove && lastMove.newCoords.X === index && lastMove.newCoords.Y === j) {
              lastMove.merge = true;
              lastMove.newCoords.X = index - 1;
            } else {
              this.cellHistory.push({
                value: mergeValue,
                oldCoords: {
                  X: index,
                  Y: j,
                },
                newCoords: {
                  X: index - 1,
                  Y: j,
                },
                merge: true,
              });
            }
            this.board[index - 1][j] = mergeValue;
            this.board[index][j] = 0;
            index--;
          }
          index++;
        }
      }
    }
  }

  moveCellDown() {
    for (let j = 0; j < this.board.length; j++) {
      let index = this.board.length - 1;
  
      for (let i = this.board.length - 1; i >= 0; i--) {
        if (this.board[i][j] !== 0) {
          let cellValue = this.board[i][j];
  
          if (index !== i) {
            this.cellHistory.push({
              value: cellValue,
              oldCoords: {
                X: i,
                Y: j,
              },
              newCoords: {
                X: index,
                Y: j,
              },
              move: true,
            });
            this.board[index][j] = cellValue;
            this.board[i][j] = 0;
          }
  
          if (index < this.board.length - 1 && this.board[index][j] === this.board[index + 1][j]) {
            let mergeValue = this.board[index][j] * 2;
            const lastMove = this.cellHistory[this.cellHistory.length - 1];

            if (lastMove && lastMove.newCoords.X === index && lastMove.newCoords.Y === j) {
              lastMove.merge = true;
              lastMove.newCoords.X = index + 1;
            } else {
              this.cellHistory.push({
                value: cellValue,
                oldCoords: {
                  X: i,
                  Y: j,
                },
                newCoords: {
                  X: index + 1,
                  Y: j,
                },
                merge: true,
              });
            }
            this.board[index + 1][j] = mergeValue;
            this.board[index][j] = 0;
            index++; 
          }
          index--;
        }
      }
    }
  }

  getScore() {
    let score = 0; 

    for(let el of this.board) {
      score += el.reduce((acc, curVal) => acc + curVal, 0)
    }

    return score
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
  getStatus() {}

  start() {
    this.startButton.textContent = 'Restart';
    this.startButton.className = 'button restart';
    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.addRandomCell();
    this.addRandomCell();
    
    this.displayBoard();
  }
  
  restart() {
    this.clearBoard();
    this.cellHistory = [];
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

      this.cellHistory.push({
        value: this.board[randomEmptyCell.x][randomEmptyCell.y],
        newCoords: {
          X: randomEmptyCell.x,
          Y: randomEmptyCell.y,
        },
        newCell: true,
      });
    }
  }
  
  displayGame() {
    this.displayBoard();
    this.scoreboard.textContent = this.getScore();
  }

  displayBoard() {
    // Если клетка есть на доске и в стеке ее трогать не нужно
    // Если клетка есть в стеке но нет на доске прописать что она появиться через время общей анимации
    // Если клетка есть на доске но нет в стеке поставить анимацию с псевдоелементом и убрать клетку
    // Если клетки нет на доске и в стеке то трогать ничего не нужно.
    for(const cellMove of this.cellHistory) {
      const newCell = document.querySelector(`#cell${cellMove.newCoords.X}${cellMove.newCoords.Y}`);
      
      if(cellMove.newCell) {
        newCell.textContent = cellMove.value;

        // Сделать анимацию появления
      } else {
        const oldCell = document.querySelector(`#cell${cellMove.oldCoords.X}${cellMove.oldCoords.Y}`);
        const movingBlock = document.createElement('div');
        movingBlock.className = `moving-cell field-cell--${cellMove.value}`;

        if (pseudoElement) {
          pseudoElement.style.transform = `translate(${cell.offsetLeft}px, ${cell.offsetTop}px)`;
          pseudoElement.style.opacity = '1';

          setTimeout(() => {
            pseudoElement.style.transform = `translate(${dx}px, ${dy}px)`;
            pseudoElement.style.transform = 'none';
          }, 300);

          setTimeout(() => {
            oldCell.classList.remove('animate-before');
          }, 1000);
        }
      }  
           
    }
    // this.cell.className = `field-cell field-cell--${this.board[i][j]}`
    // this.cell.textContent = '';
    // this.cell.className = `field-cell`;

    const newCells = this.cellHistory.filter((el) => el.newCell === true);

    for(let el of newCells) {
      const newCell = document.querySelector(`#cell${el.newCoords.X}${el.newCoords.Y}`)
      newCell.className = `field-cell field-cell--${el.value}`
    }
  }

  // animationMoveCell(cell, dx, dy) {
  //   const pseudoElement = cell.querySelector('::before');
  
  //   pseudoElement.style.transform = `translate(${dx}px, ${dy}px)`;
  
  //   setTimeout(() => {
  //     cell.style.transform = `translate(${dx}px, ${dy}px)`;
  //     pseudoElement.style.transform = 'none';
  //   }, 300);
  // }

  // clearBoard() {
  //   for (let i = 0; i < this.board.length; i++) {
  //     for (let j = 0; j < this.board.length; j++) {
  //       this.cell = document.querySelector(`#cell${i}${j}`);
  //       this.cell.textContent = '';
  //     }
  //   }
  // }
}

module.exports = Game;



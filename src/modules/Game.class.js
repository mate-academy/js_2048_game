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
    this.status = 'idle';
  }

  moveLeft() {
    this.cellHistory = [];
    const initBoard = JSON.stringify(this.board);
    this.moveCellLeft ();
    if (JSON.stringify(this.board) !== initBoard) {
      this.addRandomCell ();
    }
    // this.upDateBoard();
    this.displayGame();
    console.log(this.board);
  }

  moveRight() {
    this.cellHistory = [];
    const initBoard = JSON.stringify(this.board);
    this.moveCellRight ();
    if (JSON.stringify(this.board) !== initBoard) {
      this.addRandomCell ();
    }
    this.displayGame();
    // this.upDateBoard();
    console.log(this.board);
  }

  moveUp() {
    this.cellHistory = [];
    const initBoard = JSON.stringify(this.board);
    this.moveCellUp ();
    if (JSON.stringify(this.board) !== initBoard) {
      this.addRandomCell ();
    }
    this.displayGame();
    // this.upDateBoard();
    console.log(this.board);
  }

  moveDown() {
    this.cellHistory = [];
    const initBoard = JSON.stringify(this.board);
    this.moveCellDown ();
    if (JSON.stringify(this.board) !== initBoard) {
      this.addRandomCell ();
    }
    this.displayGame();
    // this.upDateBoard();
    console.log(this.board);
  }

  moveCellLeft() {
    for (let y = 0; y < this.board.length; y++) {
      let index = 0;
  
      for (let x = 0; x < this.board.length; x++) {
        if (this.board[y][x] !== 0) {
          let cellValue = this.board[y][x];
  
          if (index !== x) {
            this.cellHistory.push({
              value: cellValue,
              oldCoords: {
                X: x,
                Y: y,
              },
              newCoords: {
                X: index,
                Y: y,
              },
              move: true,
            });
  
            this.board[y][index] = cellValue;
            this.board[y][x] = 0;
          }
  
          if (index > 0 && this.board[y][index] === this.board[y][index - 1]) {
            let mergeValue = this.board[y][index] * 2;
            const lastMove = this.cellHistory[this.cellHistory.length - 1];
  
            if (lastMove && lastMove.newCoords.Y === y && lastMove.newCoords.X === index) {
              lastMove.merge = true;
              lastMove.newCoords.X = index - 1;
              lastMove.problem = true; 
            } else {
              this.cellHistory.push({
                value: mergeValue,
                oldCoords: {
                  Y: y,
                  X: index,
                },
                newCoords: {
                  Y: y,
                  X: index - 1,
                },
                merge: true,
              });
            }
  
            this.board[y][index - 1] = mergeValue;
            this.board[y][index] = 0;
            index--;
          }
          index++;
        }
      }
    }
  }
  
  moveCellRight() {
    for (let y = 0; y < this.board.length; y++) {
      let index = this.board.length - 1;  
  
      for (let x = this.board.length - 1; x >= 0; x--) {
        if (this.board[y][x] !== 0) {
          let cellValue = this.board[y][x];
  
          if (index !== x) {
            this.cellHistory.push({
              value: cellValue,
              oldCoords: {
                Y: y,
                X: x,
              },
              newCoords: {
                Y: y,
                X: index,
              },
              move: true,
            });
  
            this.board[y][index] = cellValue;
            this.board[y][x] = 0;
          }
  
          if (index < this.board.length - 1 && this.board[y][index] === this.board[y][index + 1]) {
            let mergeValue = this.board[y][index] * 2;
  
            const lastMove = this.cellHistory[this.cellHistory.length - 1];
            if (lastMove && lastMove.newCoords.Y === y && lastMove.newCoords.X === index) {
              lastMove.merge = true;
              lastMove.newCoords.X = index + 1;
            } else {
              this.cellHistory.push({
                value: mergeValue,
                oldCoords: {
                  Y: y,
                  X: index,
                },
                newCoords: {
                  Y: y,
                  X: index + 1,
                },
                merge: true,
              });
            }
  
            this.board[y][index + 1] = mergeValue;
            this.board[y][index] = 0;
            index++;
          }
          index--;
        }
      }
    }
  }
  
  moveCellUp() {
    for (let x = 0; x < this.board.length; x++) {
      let index = 0;
  
      for (let y = 0; y < this.board.length; y++) {
        if (this.board[y][x] !== 0) {
          let cellValue = this.board[y][x];
  
          if (index !== y) {
            this.cellHistory.push({
              value: cellValue,
              oldCoords: {
                Y: y,
                X: x,
              },
              newCoords: {
                Y: index,
                X: x,
              },
              move: true,
            });
            this.board[index][x] = cellValue;
            this.board[y][x] = 0;
          }
  
          if (index > 0 && this.board[index][x] === this.board[index - 1][x]) {
            let mergeValue = this.board[index][x] * 2;
            const lastMove = this.cellHistory[this.cellHistory.length - 1];

            if (lastMove && lastMove.newCoords.Y === index && lastMove.newCoords.X === x) {
              lastMove.merge = true;
              lastMove.newCoords.Y = index - 1;
            } else {
              this.cellHistory.push({
                value: mergeValue,
                oldCoords: {
                  Y: index,
                  X: x,
                },
                newCoords: {
                  Y: index - 1,
                  X: x,
                },
                merge: true,
              });
            }
            this.board[index - 1][x] = mergeValue;
            this.board[index][x] = 0;
            index--;
          }
          index++;
        }
      }
    }
  }

  moveCellDown() {
    for (let x = 0; x < this.board.length; x++) {
      let index = this.board.length - 1;
  
      for (let y = this.board.length - 1; y >= 0; y--) {
        if (this.board[y][x] !== 0) {
          let cellValue = this.board[y][x];
  
          if (index !== y) {
            this.cellHistory.push({
              value: cellValue,
              oldCoords: {
                Y: y,
                X: x,
              },
              newCoords: {
                Y: index,
                X: x,
              },
              move: true,
            });
            this.board[index][x] = cellValue;
            this.board[y][x] = 0;
          }
  
          if (index < this.board.length - 1 && this.board[index][x] === this.board[index + 1][x]) {
            let mergeValue = this.board[index][x] * 2;
            const lastMove = this.cellHistory[this.cellHistory.length - 1];

            if (lastMove && lastMove.newCoords.Y === index && lastMove.newCoords.X === x) {
              lastMove.merge = true;
              lastMove.newCoords.Y = index + 1;
            } else {
              this.cellHistory.push({
                value: cellValue,
                oldCoords: {
                  Y: y,
                  X: x,
                },
                newCoords: {
                  Y: index + 1,
                  X: x,
                },
                merge: true,
              });
            }
            this.board[index + 1][x] = mergeValue;
            this.board[index][x] = 0;
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
  getStatus() {
    return this.status;
  }

  setStatus(status) {
    switch (status) {
      case 'idle':
        this.status = 'idle';
        break;
      case 'playing':
        this.status = 'playing';
        break;
      case 'win':
        this.status = 'win';
        break;
      case 'lose':
        this.status = 'lose';
        break;
      default:
      return;
    }
  }

  start() {
    this.startButton.textContent = 'Restart';
    this.startButton.className = 'button restart';
    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.addRandomCell();
    this.addRandomCell();
    
    this.displayBoard();
    console.log(this.board);
  }
  
  restart() {
    this.clearBoard();
    this.cellHistory = [];
    this.start();
  }

  addRandomCell() {
    const emptyCell = [];

    for (let x = 0; x < this.board.length; x++) {
      for (let y = 0; y < this.board.length; y++) {
        if (!this.board[x][y]) {
          emptyCell.push({ x: x, y: y });
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

    for(const cellMove of this.cellHistory) {
      const newCell = document.querySelector(`#cell${cellMove.newCoords.X}${cellMove.newCoords.Y}`);
      
      if(cellMove.newCell) {
        newCell.textContent = cellMove.value;
        newCell.classList.add(`field-cell--${cellMove.value}`)
        
        const keyFrames = [
          {transform: "scale(1)"},
          {transform: "scale(1.56)"},
          {transform: "scale(1)"},
        ];

        const newspaperTiming = {
          duration: 400,
          iterations: 1,
          easing: 'ease-in-out',
        };

        newCell.animate(keyFrames, newspaperTiming);
      } else {
        const animationDuration = 200;
        const oldCell = document.querySelector(`#cell${cellMove.oldCoords.X}${cellMove.oldCoords.Y}`);
        const movingBlock = document.createElement('div');
        movingBlock.className = `moving-block field-cell--${cellMove.value}`;
        movingBlock.textContent = cellMove.value;

        const startTranstateY = 85 * cellMove.oldCoords.Y;
        const startTranstateX = 85 * cellMove.oldCoords.X;
        
        const endTranslateY = 85 * cellMove.newCoords.Y;
        const endTranslateX = 85 * cellMove.newCoords.X;

        console.log('start', cellMove.oldCoords.Y, cellMove.oldCoords.X,'end', cellMove.newCoords.Y, cellMove.newCoords.X, 'value', cellMove.value, this.cellHistory)
        
        oldCell.appendChild(movingBlock);

        const keyFrames = [
          {transform: `translate(${startTranstateX}px,${startTranstateY}px)`},
          {transform: `translate(${endTranslateX}px,${endTranslateY}px)`},
        ]
        
        const timing = {
          duration: animationDuration,
          iterations: 1,
          easing: 'ease-in-out',
        }

        const reversOldCell = document.querySelector(`#cell${cellMove.oldCoords.Y}${cellMove.oldCoords.X}`);
        
        reversOldCell.className = 'field-cell';
        reversOldCell.textContent = '';
        
        movingBlock.animate(keyFrames, timing)
        
        const reversNewCell = document.querySelector(`#cell${cellMove.newCoords.Y}${cellMove.newCoords.X}`);
        setTimeout(() => {
          reversNewCell.textContent = cellMove.value;
          reversNewCell.classList.add(`field-cell--${cellMove.value}`);
          movingBlock.remove();
        }, animationDuration - 5);
      }
    }
    // const newCells = this.cellHistory.filter((el) => el.newCell === true);

    // for(let el of newCells) {
    //   const newCell = document.querySelector(`#cell${el.newCoords.X}${el.newCoords.Y}`)
    //   newCell.className = `field-cell field-cell--${el.value}`
    // }
  }

  upDateBoard() {
    this.clearBoard();
    for (let y = 0; y < this.board.length; y++) {
      for (let x = 0; x < this.board.length; x++) {
        if(this.board[y][x] !== 0){
          const cell = document.querySelector(`#cell${y}${x}`);
          cell.textContent = this.board[y][x];
          cell.className = `field-cell field-cell--${this.board[y][x].value}`;
        }
      }
    }
  }

  clearBoard() {
    for (let y = 0; y < this.board.length; y++) {
      for (let x = 0; x < this.board.length; x++) {
        const cell = document.querySelector(`#cell${y}${x}`);
        cell.textContent = '';
        cell.className = 'field-cell';
      }
    }
  }

}

module.exports = Game;



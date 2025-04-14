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

  move(direction) {
    if (this.getStatus() === 'playing') {
      this.cellHistory = [];

      const initBoard = JSON.stringify(this.board);

      switch (direction) {
        case 'left':
          this.moveLeft(this.board);
          break;
        case 'right':
          this.moveRight(this.board);
          break;
        case 'up':
          this.moveUp(this.board);
          break;
        case 'down':
          this.moveDown(this.board);
          break;
      }

      if (JSON.stringify(this.board) !== initBoard) {
        this.addRandomCell();
        this.displayGame();
      } else {
        const checkboard = JSON.parse(JSON.stringify(this.board));
        const emptyCell = this.getEmptyCell();

        this.moveLeft(checkboard);
        this.moveRight(checkboard);
        this.moveUp(checkboard);
        this.moveDown(checkboard);
        if(!emptyCell.length) {
          if (JSON.stringify(checkboard) === initBoard) {
            this.setStatus('lose');
          }
        }
      }
    }
  }

  // #region Move Cells

  moveLeft(board) {
    for (let y = 0; y < board.length; y++) {
      let index = 0;

      for (let x = 0; x < board.length; x++) {
        if (board[y][x] !== 0) {
          const cellValue = board[y][x];

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

            board[y][index] = cellValue;
            board[y][x] = 0;
          }

          if (index > 0 && board[y][index] === board[y][index - 1]) {
            const mergeValue = board[y][index] * 2;
            const lastMove = this.cellHistory[this.cellHistory.length - 1];

            if (
              lastMove &&
              lastMove.newCoords.Y === y &&
              lastMove.newCoords.X === index
            ) {
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

            board[y][index - 1] = mergeValue;
            board[y][index] = 0;
            index--;
          }
          index++;
        }
      }
    }

    return board;
  }

  moveRight(board) {
    for (let y = 0; y < board.length; y++) {
      let index = board.length - 1;

      for (let x = board.length - 1; x >= 0; x--) {
        if (board[y][x] !== 0) {
          const cellValue = board[y][x];

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

            board[y][index] = cellValue;
            board[y][x] = 0;
          }

          if (
            index < board.length - 1 &&
            board[y][index] === board[y][index + 1]
          ) {
            const mergeValue = board[y][index] * 2;

            const lastMove = this.cellHistory[this.cellHistory.length - 1];

            if (
              lastMove &&
              lastMove.newCoords.Y === y &&
              lastMove.newCoords.X === index
            ) {
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

            board[y][index + 1] = mergeValue;
            board[y][index] = 0;
            index++;
          }
          index--;
        }
      }
    }

    return board;
  }

  moveUp(board) {
    for (let x = 0; x < board.length; x++) {
      let index = 0;

      for (let y = 0; y < board.length; y++) {
        if (board[y][x] !== 0) {
          const cellValue = board[y][x];

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
            board[index][x] = cellValue;
            board[y][x] = 0;
          }

          if (index > 0 && board[index][x] === board[index - 1][x]) {
            const mergeValue = board[index][x] * 2;
            const lastMove = this.cellHistory[this.cellHistory.length - 1];

            if (
              lastMove &&
              lastMove.newCoords.Y === index &&
              lastMove.newCoords.X === x
            ) {
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
            board[index - 1][x] = mergeValue;
            board[index][x] = 0;
            index--;
          }
          index++;
        }
      }
    }

    return board;
  }

  moveDown(board) {
    for (let x = 0; x < board.length; x++) {
      let index = board.length - 1;

      for (let y = board.length - 1; y >= 0; y--) {
        if (board[y][x] !== 0) {
          const cellValue = board[y][x];

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
            board[index][x] = cellValue;
            board[y][x] = 0;
          }

          if (
            index < board.length - 1 &&
            board[index][x] === board[index + 1][x]
          ) {
            const mergeValue = board[index][x] * 2;
            const lastMove = this.cellHistory[this.cellHistory.length - 1];

            if (
              lastMove &&
              lastMove.newCoords.Y === index &&
              lastMove.newCoords.X === x
            ) {
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
            board[index + 1][x] = mergeValue;
            board[index][x] = 0;
            index++;
          }
          index--;
        }
      }
    }

    return board;
  }

  // #endregion

  getScore() {
    let score = 0;

    for (const el of this.board) {
      score += el.reduce((acc, curVal) => acc + curVal, 0);
    }

    return score;
  }

  setStatus(stat) {
    switch (stat) {
      case 'playing':
        this.status = 'playing';
        this.setMessage();
        break;
      case 'idle':
        this.status = 'idle';
        this.setMessage('start');
        break;
      case 'win':
        this.status = 'win';
        this.setMessage('win');
        break;
      case 'lose':
        this.status = 'lose';
        this.setMessage('lose');
        break;
      default:
    }
  }

  getState() {
    return this.board;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.startButton.textContent = 'Restart';
    this.startButton.className = 'button restart';
    this.setStatus('playing');
    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.addRandomCell();
    this.addRandomCell();
    this.displayGame();
  }

  setMessage(message) {
    const win = document.querySelector('.message-win');
    const lose = document.querySelector('.message-lose');
    const start = document.querySelector('.message-start');

    lose.className = 'message message-lose hidden';
    start.className = 'message message-start hidden';
    win.className = 'message message-win hidden';

    switch (message) {
      case 'win':
        win.className = 'message message-win';
        break;
      case 'lose':
        lose.className = 'message message-lose';
        break;
      case 'start':
        start.className = 'message message-start';
        break;
      default:
    }
  }

  restart() {
    this.clearBoard();
    this.cellHistory = [];
    this.setStatus('idle');
    this.startButton.textContent = 'Start';
    this.startButton.className = 'button start';
    this.scoreboard.textContent = 0;
  }

  getEmptyCell() {
    const emptyCell = [];

    for (let y = 0; y < this.board.length; y++) {
      for (let x = 0; x < this.board.length; x++) {
        if (!this.board[y][x]) {
          emptyCell.push({ x: x, y: y });
        }
      }
    }

    return emptyCell;
  }

  addRandomCell() {
    const emptyCell = this.getEmptyCell();

    if (emptyCell.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCell.length);
      const randomEmptyCell = emptyCell[randomIndex];

      this.board[randomEmptyCell.y][randomEmptyCell.x] =
        Math.random() < 0.9 ? 2 : 4;

      this.cellHistory.push({
        value: this.board[randomEmptyCell.y][randomEmptyCell.x],
        newCoords: {
          X: randomEmptyCell.x,
          Y: randomEmptyCell.y,
        },
        newCell: true,
      });
    }
  }

  displayGame() {
    this.displayAnimateBoard();
    this.scoreboard.textContent = this.getScore();
  }

  displayAnimateBoard() {
    for (const cellMove of this.cellHistory) {
      const perentElement = document.querySelector('.move-zone');

      if (cellMove.newCell) {
        const newBlock = document.createElement('div');

        perentElement.appendChild(newBlock);
        newBlock.textContent = cellMove.value;
        newBlock.className = `moving-block field-cell--${cellMove.value}`;
        newBlock.id = `cell${cellMove.newCoords.Y}${cellMove.newCoords.X}`;

        newBlock.style.setProperty('--y', cellMove.newCoords.Y);
        newBlock.style.setProperty('--x', cellMove.newCoords.X);

        const keyFrames = [
          { transform: 'scale(1)' },
          { transform: 'scale(1.56)' },
          { transform: 'scale(1)' },
        ];

        const newspaperTiming = {
          duration: 400,
          iterations: 1,
          easing: 'ease-in-out',
        };

        newBlock.animate(keyFrames, newspaperTiming);
      } else {
        if (this.getStatus() === 'playing') {
          const movingBlock = document.getElementById(
            `cell${cellMove.oldCoords.Y}${cellMove.oldCoords.X}`,
          );

          const nextBlockPosition = `cell${cellMove.newCoords.Y}${cellMove.newCoords.X}`;

          if (document.querySelector('#' + nextBlockPosition)) {
            document.querySelector('#' + nextBlockPosition).remove();
          }
          movingBlock.id = nextBlockPosition;

          movingBlock.className = `moving-block field-cell--${this.board[cellMove.newCoords.Y][cellMove.newCoords.X]}`;

          movingBlock.textContent =
            this.board[cellMove.newCoords.Y][cellMove.newCoords.X];

          movingBlock.style.setProperty('--y', cellMove.newCoords.Y);
          movingBlock.style.setProperty('--x', cellMove.newCoords.X);
        }
      }
    }
  }

  nonAnimateUpdateBoard() {
    this.clearBoard();

    for (let y = 0; y < this.board.length; y++) {
      for (let x = 0; x < this.board.length; x++) {
        if (this.board[y][x] !== 0) {
          const cell = document.querySelector(`#cell${y}${x}`);

          cell.textContent = this.board[y][x];
          cell.className = `field-cell field-cell--${this.board[y][x]}`;
        }
      }
    }
  }

  clearBoard() {
    const childrenToRemove = document.querySelectorAll('.moving-block');

    childrenToRemove.forEach((child) => {
      child.remove();
    });
  }
}

module.exports = Game;
